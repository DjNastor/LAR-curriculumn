import React, { useState, useEffect } from "react";
import { Curriculum } from "../types";
import { User } from "firebase/auth";
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken,
} from "../lib/googleAuth";
import {
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
  syncCurriculumScheduleToCalendar,
  getUserCalendars,
  CalendarEvent,
  UserCalendar,
} from "../lib/googleCalendar";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Clock,
  ExternalLink,
  Check,
  AlertCircle,
  LogOut,
  Sparkles,
  Layers,
  Award,
  ShieldAlert,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface GoogleCalendarModalProps {
  curriculum: Curriculum;
  onClose: () => void;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  curriculum,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Calendar State
  const [calendars, setCalendars] = useState<UserCalendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("primary");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Sync Schedule Form State
  const [activeTab, setActiveTab] = useState<"sync" | "events" | "create">("sync");
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    return nextMonday.toISOString().split("T")[0];
  });
  const [targetCalendar, setTargetCalendar] = useState<string>("new");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Create Event Form State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("14:00");
  const [newEventDuration, setNewEventDuration] = useState("60");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Confirmation Modals for Destructive/Mutating Operations
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        fetchEventsAndCalendars(t);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await fetchEventsAndCalendars(res.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || "Sign in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setEvents([]);
  };

  const fetchEventsAndCalendars = async (accessToken: string) => {
    setLoadingEvents(true);
    try {
      const cList = await getUserCalendars(accessToken);
      setCalendars(cList);
      const evs = await getCalendarEvents(accessToken, selectedCalendarId);
      setEvents(evs);
    } catch (err: any) {
      console.error("Calendar fetch error:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleRefreshEvents = async () => {
    if (!token) return;
    setLoadingEvents(true);
    try {
      const evs = await getCalendarEvents(token, selectedCalendarId);
      setEvents(evs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Sync Curriculum Schedule to Google Calendar
  const handleSyncSchedule = async () => {
    if (!token) return;
    setIsSyncing(true);
    setSyncSuccessMsg(null);

    try {
      const parsedDate = new Date(startDateStr);
      const res = await syncCurriculumScheduleToCalendar(
        token,
        curriculum,
        parsedDate,
        targetCalendar
      );

      setSyncSuccessMsg(
        `Successfully scheduled ${res.createdCount} events into Google Calendar!`
      );
      await fetchEventsAndCalendars(token);
    } catch (err: any) {
      alert("Calendar sync error: " + (err.message || "Unknown error"));
    } finally {
      setIsSyncing(false);
    }
  };

  // Create Single Event
  const handleCreateCustomEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newEventTitle || !newEventDate) return;

    setIsCreatingEvent(true);
    try {
      const startDateTime = new Date(`${newEventDate}T${newEventTime}:00`);
      const endDateTime = new Date(
        startDateTime.getTime() + parseInt(newEventDuration) * 60 * 1000
      );
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

      await createCalendarEvent(
        token,
        {
          summary: newEventTitle,
          description: newEventDesc,
          start: { dateTime: startDateTime.toISOString(), timeZone: tz },
          end: { dateTime: endDateTime.toISOString(), timeZone: tz },
        },
        selectedCalendarId
      );

      setNewEventTitle("");
      setNewEventDesc("");
      setActiveTab("events");
      await fetchEventsAndCalendars(token);
    } catch (err: any) {
      alert("Error creating event: " + err.message);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Execute Confirmed Delete (workspace security requirement)
  const handleConfirmDelete = async () => {
    if (!token || !eventToDelete?.id) return;
    setIsDeleting(true);

    try {
      await deleteCalendarEvent(token, eventToDelete.id, selectedCalendarId);
      setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (err: any) {
      alert("Error deleting event: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Execute Confirmed Update (workspace security requirement)
  const handleConfirmUpdate = async () => {
    if (!token || !eventToEdit?.id) return;
    setIsUpdating(true);

    try {
      const updated = await updateCalendarEvent(
        token,
        eventToEdit.id,
        { summary: editTitle },
        selectedCalendarId
      );

      setEvents((prev) =>
        prev.map((ev) => (ev.id === eventToEdit.id ? { ...ev, summary: updated.summary } : ev))
      );
      setEventToEdit(null);
    } catch (err: any) {
      alert("Error updating event: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                Google Calendar Studio Schedule
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Sync Lukulu Academy syllabus workshops, assignments, and capstones directly to Google Calendar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-medium px-2 py-1 rounded bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* User Auth Banner */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-9 h-9 rounded-full border border-amber-500/40"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-sm">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    {user.displayName || "Google Calendar User"}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <div className="text-xs text-zinc-300">
                Connect your Google Account to manage live classes, assignment deadlines, and studio sessions in Google Calendar.
              </div>

              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="gsi-material-button shrink-0 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center gap-2.5 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                </svg>
                <span>{isSigningIn ? "Signing in..." : "Sign in with Google"}</span>
              </button>
            </div>
          )}
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tab Selection */}
        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <button
                onClick={() => setActiveTab("sync")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "sync"
                    ? "bg-amber-500 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sync Syllabus Schedule</span>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "events"
                    ? "bg-amber-500 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Upcoming Events ({events.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "create"
                    ? "bg-amber-500 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Session</span>
              </button>
            </div>

            {/* TAB 1: SYNC SYLLABUS SCHEDULE */}
            {activeTab === "sync" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Syncing: {curriculum.title}
                    </h3>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {curriculum.durationWeeks} Weeks • {curriculum.modules.length} Modules
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Automatically schedules weekly live workshops, practical assignment due dates, and the final music business capstone into Google Calendar.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Course Start Date:
                      </label>
                      <input
                        type="date"
                        value={startDateStr}
                        onChange={(e) => setStartDateStr(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Target Google Calendar:
                      </label>
                      <select
                        value={targetCalendar}
                        onChange={(e) => setTargetCalendar(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="new">
                          + Create New Calendar ("Lukulu Academy: {curriculum.trackDaw}")
                        </option>
                        <option value="primary">Primary Google Calendar</option>
                        {calendars
                          .filter((c) => !c.primary)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.summary}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-zinc-900">
                    <div className="text-[11px] font-mono text-zinc-400">
                      Will create ~{curriculum.modules.length * 2 + 1} Google Calendar events
                    </div>

                    <button
                      onClick={handleSyncSchedule}
                      disabled={isSyncing}
                      className="py-2.5 px-5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                          <span>Syncing to Google Calendar...</span>
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>Sync Schedule to Google Calendar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {syncSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{syncSuccessMsg}</span>
                    </div>

                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Google Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UPCOMING EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Showing upcoming events from Google Calendar
                  </span>

                  <button
                    onClick={handleRefreshEvents}
                    disabled={loadingEvents}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    title="Refresh events"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loadingEvents ? "animate-spin text-amber-400" : ""}`}
                    />
                  </button>
                </div>

                {loadingEvents ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    Loading events from Google Calendar...
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
                    No upcoming events found on Google Calendar. Click "Sync Syllabus Schedule" above to add your classes!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {events.map((ev) => {
                      const startDate = ev.start?.dateTime || ev.start?.date;
                      const formattedDate = startDate
                        ? new Date(startDate).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "All Day";

                      return (
                        <div
                          key={ev.id}
                          className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs text-zinc-100 flex items-center gap-2">
                              {ev.summary}
                            </h4>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                              <span className="flex items-center gap-1 text-amber-400">
                                <Clock className="w-3 h-3" />
                                {formattedDate}
                              </span>
                              {ev.location && (
                                <span className="truncate max-w-xs">{ev.location}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEventToEdit(ev);
                                setEditTitle(ev.summary);
                              }}
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400"
                              title="Edit Event Title"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setEventToDelete(ev)}
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {ev.htmlLink && (
                              <a
                                href={ev.htmlLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                                title="Open in Google Calendar"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADD CUSTOM SESSION */}
            {activeTab === "create" && (
              <form onSubmit={handleCreateCustomEvent} className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-200">
                    Schedule Custom Studio Session / Class
                  </h3>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Event Title:</label>
                    <input
                      type="text"
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="e.g. Lukulu 1-on-1 Stem Mixing Mentorship"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Date:</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Start Time:</label>
                      <input
                        type="time"
                        required
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Duration (Mins):</label>
                      <select
                        value={newEventDuration}
                        onChange={(e) => setNewEventDuration(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="30">30 Mins</option>
                        <option value="60">1 Hour</option>
                        <option value="90">1.5 Hours</option>
                        <option value="120">2 Hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Notes / Agenda:</label>
                    <textarea
                      rows={2}
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="e.g. Review FL Studio Gross Beat presets and vocals..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingEvent}
                      className="py-2 px-5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
                    >
                      {isCreatingEvent ? (
                        <span>Creating Event...</span>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Google Calendar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MANDATORY USER CONFIRMATION DIALOG FOR DELETE OPERATION */}
        {eventToDelete && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-zinc-100">
                  Confirm Delete Event
                </h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to delete <strong>"{eventToDelete.summary}"</strong> from your Google Calendar?
                This action will mutate your Google Calendar data.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEventToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm & Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MANDATORY USER CONFIRMATION DIALOG FOR UPDATE OPERATION */}
        {eventToEdit && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400">
                <Edit2 className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-zinc-100">
                  Edit Event Title
                </h3>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">New Event Summary:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <p className="text-[11px] text-zinc-400">
                This will update the title in your Google Calendar data.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEventToEdit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isUpdating || !editTitle.trim()}
                  onClick={handleConfirmUpdate}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md transition disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Confirm & Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
