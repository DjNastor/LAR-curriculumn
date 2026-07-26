import React from "react";
import { Sparkles, Music2, BookOpen, Download, Disc, Layers, Volume2, Calendar, HardDrive } from "lucide-react";

interface HeaderProps {
  onOpenForm: () => void;
  onOpenPresets: () => void;
  onOpenExport: () => void;
  onOpenCalendar: () => void;
  onOpenDrive?: () => void;
  onToggleSynth: () => void;
  isSynthActive: boolean;
  activeCurriculumTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenForm,
  onOpenPresets,
  onOpenExport,
  onOpenCalendar,
  onOpenDrive,
  onToggleSynth,
  isSynthActive,
  activeCurriculumTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 font-black tracking-tighter text-lg">
            LA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                Lukulu Academy & Recordings
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Curriculum Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              FL Studio • Cubase • Reason • Music Business & Rights
            </p>
          </div>
        </div>

        {/* Current Syllabus Banner (Desktop) */}
        {activeCurriculumTitle && (
          <div className="hidden xl:flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-1.5 max-w-sm truncate text-xs text-zinc-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-medium">{activeCurriculumTitle}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {/* Groove Synth Player Toggle */}
          <button
            onClick={onToggleSynth}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isSynthActive
                ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse shadow-md shadow-amber-500/10"
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
            }`}
            title="Audio Groove Synth Engine"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Groove Synth</span>
          </button>

          {/* Google Calendar Schedule Button */}
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-blue-500/30 text-blue-300 transition-all shadow-sm"
            title="Google Calendar Schedule Sync"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Calendar</span>
          </button>

          {/* Google Drive Storage Button */}
          {onOpenDrive && (
            <button
              onClick={onOpenDrive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-blue-500/30 text-blue-300 transition-all shadow-sm"
              title="Google Drive Academy Storage"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Drive</span>
            </button>
          )}

          {/* Quick Presets */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Templates</span>
          </button>

          {/* Export & Copy */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export & Drive</span>
          </button>

          {/* Generate Custom */}
          <button
            onClick={onOpenForm}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Generator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
