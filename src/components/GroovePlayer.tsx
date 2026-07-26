import React, { useState, useEffect } from "react";
import { GROOVE_PRESETS, grooveEngine } from "../data/groovePatterns";
import { Play, Square, Volume2, Music, Disc } from "lucide-react";

interface GroovePlayerProps {
  onClose?: () => void;
}

export const GroovePlayer: React.FC<GroovePlayerProps> = ({ onClose }) => {
  const [activePresetId, setActivePresetId] = useState<string>("amapiano-logdrum");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    return () => {
      grooveEngine.stop();
    };
  }, []);

  const handleTogglePlay = (presetId: string) => {
    if (isPlaying && activePresetId === presetId) {
      grooveEngine.stop();
      setIsPlaying(false);
    } else {
      setActivePresetId(presetId);
      setIsPlaying(true);
      grooveEngine.playPreset(presetId, (step) => {
        setCurrentStep(step);
      });
    }
  };

  const handleStop = () => {
    grooveEngine.stop();
    setIsPlaying(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              Interactive Studio Audio Synth
            </h3>
            <p className="text-[11px] text-zinc-400">
              Web Audio API real-time synthesis for Lukulu Academy curriculum concepts
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="text-zinc-400 hover:text-zinc-100 text-xs px-2 py-1 rounded bg-zinc-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GROOVE_PRESETS.map((p) => {
          const isThisActive = isPlaying && activePresetId === p.id;
          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isThisActive
                  ? "bg-amber-500/15 border-amber-500 text-zinc-100 ring-1 ring-amber-500/40"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {p.bpm} BPM
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">{p.genre}</span>
                </div>
                <h4 className="font-bold text-xs text-zinc-100 mb-1">{p.name}</h4>
                <p className="text-[11px] text-zinc-400 mb-3 leading-snug">{p.description}</p>
              </div>

              <button
                onClick={() => handleTogglePlay(p.id)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isThisActive
                    ? "bg-red-500 hover:bg-red-400 text-white shadow-md shadow-red-500/20"
                    : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20"
                }`}
              >
                {isThisActive ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Synth Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Audio Preview</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 16-Step Visualizer Grid */}
      {isPlaying && (
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Disc className="w-3 h-3 animate-spin" />
              Synthesizing Rhythmic Beat
            </span>
            <span>Step {currentStep + 1} / 16</span>
          </div>

          <div className="grid grid-cols-16 gap-1">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-6 rounded transition-all flex items-center justify-center text-[9px] font-mono ${
                  currentStep === idx
                    ? "bg-amber-400 text-zinc-950 font-bold scale-110 shadow-md shadow-amber-400/50"
                    : idx % 4 === 0
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-zinc-900 text-zinc-600"
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
