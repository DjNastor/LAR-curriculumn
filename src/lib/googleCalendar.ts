import { Curriculum } from "../types";

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink?: string;
}

export interface UserCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
}

/**
 * Get user's primary calendar or secondary calendars list
 */
export async function getUserCalendars(accessToken: string): Promise<UserCalendar[]> {
  const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to fetch Google Calendar list");
  }

  const data = await response.json();
  return (data.items || []).map((item: any) => ({
    id: item.id,
    summary: item.summary,
    description: item.description,
    primary: item.primary || false,
  }));
}

/**
 * Fetch upcoming events from specified calendar
 */
export async function getCalendarEvents(
  accessToken: string,
  calendarId: string = "primary",
  maxResults: number = 25
): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to fetch calendar events");
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Create a new event on Google Calendar
 */
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent,
  calendarId: string = "primary"
): Promise<CalendarEvent> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to create Google Calendar event");
  }

  return await response.json();
}

/**
 * Delete an event from Google Calendar
 */
export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string,
  calendarId: string = "primary"
): Promise<boolean> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events/${encodeURIComponent(eventId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to delete Google Calendar event");
  }

  return true;
}

/**
 * Update an existing event in Google Calendar
 */
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  event: Partial<CalendarEvent>,
  calendarId: string = "primary"
): Promise<CalendarEvent> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events/${encodeURIComponent(eventId)}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to update Google Calendar event");
  }

  return await response.json();
}

/**
 * Create a new secondary calendar for Lukulu Academy Curriculum
 */
export async function createSecondaryCalendar(
  accessToken: string,
  title: string,
  description: string
): Promise<string> {
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: title,
      description,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to create secondary Google Calendar");
  }

  const data = await response.json();
  return data.id;
}

/**
 * Batch schedule an entire curriculum into Google Calendar
 */
export async function syncCurriculumScheduleToCalendar(
  accessToken: string,
  curriculum: Curriculum,
  startDate: Date,
  targetCalendarId: string = "primary"
): Promise<{ createdCount: number; calendarId: string }> {
  let destCalendarId = targetCalendarId;

  // If target is "new", create a secondary calendar
  if (targetCalendarId === "new") {
    destCalendarId = await createSecondaryCalendar(
      accessToken,
      `Lukulu Academy: ${curriculum.trackDaw} (${curriculum.genre})`,
      `Syllabus schedule for ${curriculum.title} - ${curriculum.academyName}`
    );
  }

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  let createdCount = 0;

  for (let i = 0; i < curriculum.modules.length; i++) {
    const mod = curriculum.modules[i];
    
    // Calculate start date for this week module (each module represents 1 or 2 weeks)
    const weekOffsetDays = i * 7; // offset each module by weeks
    const moduleDate = new Date(startDate.getTime() + weekOffsetDays * 24 * 60 * 60 * 1000);

    // 1. Live Workshop / Masterclass Event (e.g. Wednesday 14:00 - 16:00)
    const workshopStart = new Date(moduleDate);
    workshopStart.setHours(14, 0, 0, 0);
    const workshopEnd = new Date(moduleDate);
    workshopEnd.setHours(16, 0, 0, 0);

    const workshopEvent: CalendarEvent = {
      summary: `[Lukulu Studio] Workshop: ${mod.title}`,
      description: `Lukulu Academy Class (${curriculum.trackDaw} • ${curriculum.genre})\n\nObjective: ${mod.objective}\n\nTopics:\n- ${mod.topics.join("\n- ")}\n\nRequired Tools: ${mod.tools.dawPlugins.join(", ")}`,
      location: "Lukulu Academy Studio / Online Classroom",
      start: { dateTime: workshopStart.toISOString(), timeZone: userTz },
      end: { dateTime: workshopEnd.toISOString(), timeZone: userTz },
    };

    await createCalendarEvent(accessToken, workshopEvent, destCalendarId);
    createdCount++;

    // 2. Practical Assignment Deadline Event (e.g. Sunday 23:59)
    const deadlineDate = new Date(moduleDate.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days later
    deadlineDate.setHours(23, 59, 0, 0);

    const deadlineEvent: CalendarEvent = {
      summary: `[Assignment Due] ${mod.assignment.title}`,
      description: `Lukulu Academy Practical Assignment\n\nInstructions:\n${mod.assignment.instructions}\n\nDeliverables:\n- ${mod.assignment.deliverables.join("\n- ")}`,
      location: "Lukulu Academy Student Portal",
      start: { dateTime: deadlineDate.toISOString(), timeZone: userTz },
      end: {
        dateTime: new Date(deadlineDate.getTime() + 30 * 60 * 1000).toISOString(),
        timeZone: userTz,
      },
    };

    await createCalendarEvent(accessToken, deadlineEvent, destCalendarId);
    createdCount++;
  }

  // 3. Add Music Rights & Business Capstone Session
  const capstoneDate = new Date(startDate.getTime() + curriculum.modules.length * 7 * 24 * 60 * 60 * 1000);
  capstoneDate.setHours(15, 0, 0, 0);

  const capstoneEvent: CalendarEvent = {
    summary: `[Capstone] ${curriculum.musicBusinessModule.title}`,
    description: `Lukulu Academy Music Business & Rights Final Workshop\n\nObjective: ${curriculum.musicBusinessModule.objective}\n\nDeliverable: ${curriculum.musicBusinessModule.practicalProject}`,
    location: "Lukulu Academy Studio",
    start: { dateTime: capstoneDate.toISOString(), timeZone: userTz },
    end: {
      dateTime: new Date(capstoneDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      timeZone: userTz,
    },
  };

  await createCalendarEvent(accessToken, capstoneEvent, destCalendarId);
  createdCount++;

  return { createdCount, calendarId: destCalendarId };
}
