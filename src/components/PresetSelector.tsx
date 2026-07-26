import React from "react";
import { PRESET_TEMPLATES } from "../data/presets";
import { PresetTemplate, CourseParams } from "../types";
import { Check, Clock, Disc, Sparkles, Layers, Sliders } from "lucide-react";

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetTemplate) => void;
  onSelectParamsForForm: (params: CourseParams) => void;
  onClose: () => void;
  currentPresetId?: string;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  onSelectParamsForForm,
  onClose,
  currentPresetId,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-zinc-100">
                Lukulu Academy Master Blueprints
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Select an officially curated curriculum template or customize parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-medium px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_TEMPLATES.map((preset) => {
            const isSelected = preset.id === currentPresetId;
            return (
              <div
                key={preset.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30"
                    : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 flex items-center gap-1">
                      <Disc className="w-3 h-3 text-amber-400" />
                      {preset.trackDaw}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {preset.durationWeeks} Weeks
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    {preset.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] text-zinc-300 font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      Genre: {preset.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      Target: {preset.params.targetAudience.split("&")[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Currently Loaded</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Load Blueprint</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onSelectParamsForForm(preset.params);
                      onClose();
                    }}
                    className="py-2 px-3 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition-colors"
                    title="Customize parameters in generator form"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
