import React, { useState } from "react";
import { Curriculum } from "../types";
import { googleSignIn, getAccessToken } from "../lib/googleAuth";
import { uploadCurriculumToDrive } from "../lib/googleDrive";
import {
  Download,
  Copy,
  Check,
  FileText,
  FileCode,
  Printer,
  HardDrive,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ExportModalProps {
  curriculum: Curriculum;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ curriculum, onClose }) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveSuccessUrl, setDriveSuccessUrl] = useState<string | null>(null);

  const handleCopyMd = () => {
    navigator.clipboard.writeText(curriculum.markdownSyllabus);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(curriculum, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([curriculum.markdownSyllabus], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Lukulu-Academy-${curriculum.trackDaw.replace(/\s+/g, "-")}-${curriculum.genre.replace(/\s+/g, "-")}-Curriculum.md`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(curriculum, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Lukulu-Academy-${curriculum.trackDaw.replace(/\s+/g, "-")}-${curriculum.genre.replace(/\s+/g, "-")}-Syllabus.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${curriculum.title} — Lukulu Academy & Recordings</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h1 { color: #d97706; margin-bottom: 5px; }
            h2 { color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 6px; margin-top: 30px; }
            .badge { display: inline-block; padding: 4px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; margin-right: 6px; font-weight: bold; }
            .card { background: #fafafa; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div>
            <span class="badge">${curriculum.academyName}</span>
            <span class="badge">${curriculum.trackDaw}</span>
            <span class="badge">${curriculum.genre}</span>
            <span class="badge">${curriculum.durationWeeks} Weeks</span>
          </div>
          <h1>${curriculum.title}</h1>
          <p><strong>Audience:</strong> ${curriculum.targetAudience}</p>
          <hr />
          
          <h2>Module Breakdown</h2>
          ${curriculum.modules
            .map(
              (m) => `
            <div class="card">
              <h3>${m.weekRange}: ${m.title}</h3>
              <p><strong>Objective:</strong> ${m.objective}</p>
              <h4>Topics Covered:</h4>
              <ul>${m.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
              <h4>Practical Assignment: ${m.assignment.title}</h4>
              <p>${m.assignment.instructions}</p>
            </div>
          `
            )
            .join("")}

          <h2>Music Rights & Business</h2>
          <div class="card">
            <h3>${curriculum.musicBusinessModule.title}</h3>
            <p>${curriculum.musicBusinessModule.objective}</p>
            <ul>${curriculum.musicBusinessModule.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
          </div>

          <div class="footer">
            Lukulu Academy & Recordings • Curriculum Blueprint • Official Document
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleRealGoogleDriveExport = async () => {
    setDriveUploading(true);
    setDriveSuccessUrl(null);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) {
          throw new Error("Google Sign In failed or token was not obtained.");
        }
        token = authRes.accessToken;
      }

      const res = await uploadCurriculumToDrive(token, curriculum, "both");
      const firstLink = res.filesUploaded[0]?.webViewLink || "https://drive.google.com/drive/my-drive";
      setDriveSuccessUrl(firstLink);
    } catch (err: any) {
      alert("Google Drive upload error: " + (err.message || "Failed to upload to Drive"));
    } finally {
      setDriveUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" />
              Export & Export Formats
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Download, print, or save curriculum files for Lukulu Academy
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-medium px-2 py-1 rounded bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Download Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Download Markdown */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <FileText className="w-4 h-4 text-amber-400" />
              Markdown File (.md)
            </div>
            <p className="text-[11px] text-zinc-400">
              Formatted Markdown document with complete syllabus, topics, and rubrics.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadMd}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>

              <button
                onClick={handleCopyMd}
                className="py-2 px-3 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                title="Copy Markdown text"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Download JSON */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Structured JSON Data (.json)
            </div>
            <p className="text-[11px] text-zinc-400">
              Complete machine-readable JSON structure for LMS integration.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadJson}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="py-2 px-3 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                title="Copy JSON text"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Print / PDF Option */}
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-200">Print / Save as PDF</h4>
              <p className="text-[11px] text-zinc-400">
                Generate clean print-formatted syllabus PDF for academy handouts
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shrink-0"
          >
            Open Print View
          </button>
        </div>

        {/* Google Drive Integration */}
        <div className="p-4 bg-zinc-950 border border-blue-500/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <HardDrive className="w-4 h-4" />
              Google Drive Integration
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              Workspace OAuth Ready
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Sync this curriculum directly to your Lukulu Academy Google Drive folder for faculty review and student distribution.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleRealGoogleDriveExport}
              disabled={driveUploading}
              className="py-2 px-4 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              {driveUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading to Drive...</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Save to Google Drive</span>
                </>
              )}
            </button>

            {driveSuccessUrl && (
              <a
                href={driveSuccessUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Saved! Open Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
