import React, { useState } from "react";
import { Curriculum } from "../types";
import { Sparkles, Sliders, Check, AlertCircle } from "lucide-react";
import { postJson } from "../lib/api";

interface AICustomizerModalProps {
  curriculum: Curriculum;
  onUpdateCurriculum: (updated: Curriculum) => void;
  onClose: () => void;
}

export const AICustomizerModal: React.FC<AICustomizerModalProps> = ({
  curriculum,
  onUpdateCurriculum,
  onClose,
}) => {
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const QUICK_SUGGESTIONS = [
    "Add an extra module on stem mastering and loudness (-14 LUFS)",
    "Focus heavily on FL Studio Gross Beat and Patcher FX chains",
    "Emphasize SAMRO, CAPASSO, and Southern Africa music publishing rights",
    "Add 3-part vocal arrangement and VariAudio pitch editing lessons",
    "Include live performance setup for Reason Rack Extensions",
  ];

  const handleApplyRefinement = async (customText?: string) => {
    const textToUse = customText || instruction;
    if (!textToUse.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await postJson<{ success?: boolean; curriculum?: Curriculum; error?: string }>(
        "/api/refine-curriculum",
        { currentCurriculum: curriculum, userInstruction: textToUse }
      );

      if (data.success && data.curriculum) {
        onUpdateCurriculum(data.curriculum);
        onClose();
      } else {
        setErrorMsg(data.error || "Failed to refine curriculum");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-zinc-100">
              Refine Syllabus with AI
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-xs px-2 py-1 rounded bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Instruct Gemini AI to modify, add topics, refine assignments, or tailor stock plugin choices for <strong>{curriculum.title}</strong>.
        </p>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-2">
            Quick Refinement Prompts:
          </label>
          <div className="space-y-1.5">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInstruction(sug);
                  handleApplyRefinement(sug);
                }}
                disabled={isLoading}
                className="w-full text-left p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition flex items-center justify-between gap-2 disabled:opacity-50"
              >
                <span className="truncate">{sug}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-zinc-300">
            Or enter custom instruction:
          </label>
          <textarea
            aria-label="Custom refinement instruction"
            rows={3}
            maxLength={10000}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Add 2 extra weeks on stem mastering in FL Studio and expand the music business SAMRO split sheet lesson..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading || !instruction.trim()}
            onClick={() => handleApplyRefinement()}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Refining with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply AI Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
