import React, { useState } from "react";
import { CourseParams, CourseDuration, TrackDaw, GenreFocus } from "../types";
import { Sparkles, Sliders, Target, Clock, Disc, Music, FileText } from "lucide-react";

interface CurriculumFormProps {
  initialParams?: CourseParams;
  onSubmit: (params: CourseParams) => void;
  onCancel?: () => void;
  isLoading: boolean;
}

const DAW_OPTIONS: { id: TrackDaw; label: string; desc: string; icon: string }[] = [
  { id: "FL Studio", label: "FL Studio", desc: "Channel Rack, Piano Roll, Gross Beat, FLEX", icon: "🎹" },
  { id: "Cubase", label: "Cubase", desc: "MixConsole, VariAudio, Groove Agent SE, Padshop", icon: "🎧" },
  { id: "Reason", label: "Reason", desc: "Rack Extensions, Combinator 2, Thor, Europa", icon: "🎛️" },
  { id: "Music Business", label: "Music Business", desc: "Copyright, Royalty Accounting, Contracts, Sync", icon: "📜" },
];

const GENRE_OPTIONS: { id: GenreFocus; label: string; desc: string }[] = [
  { id: "Amapiano", label: "Amapiano", desc: "3-Step Shakers, Log Drum Synthesis, Jazz EP Chords" },
  { id: "Afro House", label: "Afro House", desc: "3-against-2 Polyrhythms, Organic Percussion, Deep Sub" },
  { id: "Electronic Dance Music", label: "EDM Mainstage", desc: "4-on-the-Floor, Supersaw Leads, Festival Drops" },
  { id: "Music Rights & Business", label: "Music Rights & Business", desc: "PRO Registrations, Mechanicals, Sync & Labels" },
];

const DURATION_OPTIONS: CourseDuration[] = [4, 8, 12, 24];

export const CurriculumForm: React.FC<CurriculumFormProps> = ({
  initialParams,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [params, setParams] = useState<CourseParams>(
    initialParams || {
      targetAudience: "Beginner to Intermediate Producers & DJs",
      durationWeeks: 4,
      trackDaw: "FL Studio",
      genre: "Amapiano",
      focusArea: "Log Drum Synthesis, 3-Step Rhythms, SAMRO & DistroKid Release",
      customNotes: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-zinc-100">
              Custom Curriculum Generator
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Configure parameters for Lukulu Academy & Recordings curriculum AI engine
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-100 text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Track / DAW Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-amber-400" />
            Core Workstation (DAW / Track)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DAW_OPTIONS.map((daw) => {
              const isSelected = params.trackDaw === daw.id;
              return (
                <button
                  type="button"
                  key={daw.id}
                  onClick={() => setParams({ ...params, trackDaw: daw.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500 text-zinc-100 ring-1 ring-amber-500/40"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="text-xl mb-1">{daw.icon}</div>
                  <div className="font-bold text-sm text-zinc-100">{daw.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{daw.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Genre & Focus */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-cyan-400" />
            Primary Genre & Focus
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GENRE_OPTIONS.map((g) => {
              const isSelected = params.genre === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setParams({ ...params, genre: g.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/40"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="font-bold text-sm text-zinc-100">{g.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{g.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              Course Duration (Weeks)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((weeks) => {
                const isSelected = params.durationWeeks === weeks;
                return (
                  <button
                    type="button"
                    key={weeks}
                    onClick={() => setParams({ ...params, durationWeeks: weeks })}
                    className={`py-2.5 rounded-xl border text-center font-bold text-sm transition-all ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/40"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {weeks} W
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-400" />
              Target Audience
            </label>
            <input
              type="text"
              value={params.targetAudience}
              onChange={(e) => setParams({ ...params, targetAudience: e.target.value })}
              placeholder="e.g. Beginners, Intermediate Producers, Songwriters, Label Managers"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Focus Area & Special Notes */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Special Focus / Key Technical Objective
            </label>
            <input
              type="text"
              value={params.focusArea}
              onChange={(e) => setParams({ ...params, focusArea: e.target.value })}
              placeholder="e.g. Log drum pitch bends, stem mastering, SAMRO royalty registration, sidechain ducking"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Additional Custom AI Prompt Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={params.customNotes}
              onChange={(e) => setParams({ ...params, customNotes: e.target.value })}
              placeholder="Include specific requirements, e.g. 'Emphasize FL Studio Gross Beat and Patcher plugins', 'Include weekly video submission rubrics', 'Focus on Southern Africa music publishing rights'."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Curriculum Blueprint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
