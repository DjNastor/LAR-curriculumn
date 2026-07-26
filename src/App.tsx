import React, { useState } from "react";
import { Header } from "./components/Header";
import { CurriculumViewer } from "./components/CurriculumViewer";
import { CurriculumForm } from "./components/CurriculumForm";
import { PresetSelector } from "./components/PresetSelector";
import { ExportModal } from "./components/ExportModal";
import { AICustomizerModal } from "./components/AICustomizerModal";
import { GoogleCalendarModal } from "./components/GoogleCalendarModal";
import { GoogleDriveModal } from "./components/GoogleDriveModal";
import { GroovePlayer } from "./components/GroovePlayer";
import { PRESET_TEMPLATES } from "./data/presets";
import { Curriculum, CourseParams, PresetTemplate } from "./types";
import { Disc, Sparkles, Layers, Volume2, AlertCircle } from "lucide-react";

export default function App() {
  const [activeCurriculum, setActiveCurriculum] = useState<Curriculum>(
    PRESET_TEMPLATES[0].curriculum
  );
  const [currentPresetId, setCurrentPresetId] = useState<string>(PRESET_TEMPLATES[0].id);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isDriveOpen, setIsDriveOpen] = useState<boolean>(false);
  const [isSynthActive, setIsSynthActive] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetTemplate) => {
    setActiveCurriculum(preset.curriculum);
    setCurrentPresetId(preset.id);
    setIsPresetsOpen(false);
  };

  const handleSelectParamsForForm = (params: CourseParams) => {
    setIsPresetsOpen(false);
    setIsFormOpen(true);
  };

  const handleGenerateCurriculum = async (params: CourseParams) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success && data.curriculum) {
        setActiveCurriculum(data.curriculum);
        setCurrentPresetId("custom-" + Date.now());
        setIsFormOpen(false);
      } else {
        setErrorMsg(
          data.error || "Generation error. Re-trying with Lukulu Academy master template."
        );
        // Fallback matching DAW or genre
        const match =
          PRESET_TEMPLATES.find(
            (p) => p.trackDaw === params.trackDaw || p.genre === params.genre
          ) || PRESET_TEMPLATES[0];
        setActiveCurriculum(match.curriculum);
        setCurrentPresetId(match.id);
        setIsFormOpen(false);
      }
    } catch (err: any) {
      console.error("Error generating curriculum:", err);
      setErrorMsg("Network or API issue. Loaded default Lukulu Academy master blueprint.");
      setActiveCurriculum(PRESET_TEMPLATES[0].curriculum);
      setIsFormOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navigation Bar */}
      <Header
        onOpenForm={() => setIsFormOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenDrive={() => setIsDriveOpen(true)}
        onToggleSynth={() => setIsSynthActive(!isSynthActive)}
        isSynthActive={isSynthActive}
        activeCurriculumTitle={activeCurriculum.title}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Groove Synth Bar if Active */}
        {isSynthActive && (
          <GroovePlayer onClose={() => setIsSynthActive(false)} />
        )}

        {/* Custom Generator Form View */}
        {isFormOpen ? (
          <CurriculumForm
            onSubmit={handleGenerateCurriculum}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        ) : (
          /* Main Interactive Curriculum Viewer */
          <CurriculumViewer
            curriculum={activeCurriculum}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenCalendar={() => setIsCalendarOpen(true)}
            onOpenDrive={() => setIsDriveOpen(true)}
            onToggleGrooveSynth={() => setIsSynthActive(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">
          Lukulu Academy & Recordings • Curriculum Generator
        </p>
        <p>
          FL Studio • Cubase • Reason • Music Business & Rights Education
        </p>
      </footer>

      {/* Modals */}
      {isPresetsOpen && (
        <PresetSelector
          onSelectPreset={handleSelectPreset}
          onSelectParamsForForm={handleSelectParamsForForm}
          onClose={() => setIsPresetsOpen(false)}
          currentPresetId={currentPresetId}
        />
      )}

      {isExportOpen && (
        <ExportModal
          curriculum={activeCurriculum}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {isCustomizerOpen && (
        <AICustomizerModal
          curriculum={activeCurriculum}
          onUpdateCurriculum={(updated) => setActiveCurriculum(updated)}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {isCalendarOpen && (
        <GoogleCalendarModal
          curriculum={activeCurriculum}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}

      {isDriveOpen && (
        <GoogleDriveModal
          curriculum={activeCurriculum}
          onClose={() => setIsDriveOpen(false)}
        />
      )}
    </div>
  );
}
