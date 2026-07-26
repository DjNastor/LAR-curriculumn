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
  listDriveFiles,
  uploadCurriculumToDrive,
  uploadFileToDrive,
  deleteDriveFile,
  createDriveFolder,
  getOrCreateLukuluFolder,
  DriveFile,
} from "../lib/googleDrive";
import {
  HardDrive,
  FolderPlus,
  Upload,
  FileText,
  FileCode,
  Folder,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  LogOut,
  ShieldAlert,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface GoogleDriveModalProps {
  curriculum: Curriculum;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  curriculum,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [activeTab, setActiveTab] = useState<"save" | "browse" | "custom">("save");
  const [lukuluFolderId, setLukuluFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Save Curriculum Form State
  const [saveFormat, setSaveFormat] = useState<"both" | "markdown" | "json">("both");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadedDriveLinks, setUploadedDriveLinks] = useState<DriveFile[]>([]);

  // Create Folder State
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Custom File Upload State
  const [customFileName, setCustomFileName] = useState("");
  const [customFileContent, setCustomFileContent] = useState("");
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);

  // Destructive Confirmation Modal
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Init Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        fetchDriveData(t);
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
        await fetchDriveData(res.accessToken);
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
    setFiles([]);
    setLukuluFolderId(null);
  };

  const fetchDriveData = async (accessToken: string) => {
    setLoadingFiles(true);
    try {
      const fId = await getOrCreateLukuluFolder(accessToken);
      setLukuluFolderId(fId);
      const driveFiles = await listDriveFiles(accessToken, fId, searchQuery);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error("Error loading Drive files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleRefreshFiles = async () => {
    if (!token) return;
    setLoadingFiles(true);
    try {
      const fId = lukuluFolderId || (await getOrCreateLukuluFolder(token));
      const driveFiles = await listDriveFiles(token, fId, searchQuery);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Upload Curriculum
  const handleSaveCurriculumToDrive = async () => {
    if (!token) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    setUploadedDriveLinks([]);

    try {
      const res = await uploadCurriculumToDrive(token, curriculum, saveFormat);
      setUploadedDriveLinks(res.filesUploaded);
      setUploadSuccessMsg(
        `Successfully saved ${res.filesUploaded.length} file(s) into Google Drive!`
      );
      await fetchDriveData(token);
    } catch (err: any) {
      alert("Drive upload error: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  // Create Custom Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await createDriveFolder(
        token,
        newFolderName.trim(),
        lukuluFolderId || undefined
      );
      setNewFolderName("");
      await fetchDriveData(token);
    } catch (err: any) {
      alert("Folder creation error: " + err.message);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Upload Custom File
  const handleUploadCustomFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !customFileName.trim() || !customFileContent) return;

    setIsUploadingCustom(true);
    try {
      await uploadFileToDrive(
        token,
        customFileName.trim(),
        customFileContent,
        "text/plain",
        lukuluFolderId || undefined
      );
      setCustomFileName("");
      setCustomFileContent("");
      setActiveTab("browse");
      await fetchDriveData(token);
    } catch (err: any) {
      alert("Custom file upload error: " + err.message);
    } finally {
      setIsUploadingCustom(false);
    }
  };

  // Confirmed Delete
  const handleConfirmDelete = async () => {
    if (!token || !fileToDelete?.id) return;
    setIsDeleting(true);

    try {
      await deleteDriveFile(token, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      alert("Delete error: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                Google Drive Academy Storage
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Save, sync, and manage syllabus documents, Markdown files, and JSON schemas in Google Drive
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
                    className="w-9 h-9 rounded-full border border-blue-500/40"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    {user.displayName || "Google Drive User"}
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
                Connect your Google Workspace Account to upload curriculum blueprints directly to Google Drive.
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

        {/* Tabs */}
        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <button
                onClick={() => setActiveTab("save")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "save"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Save Current Syllabus</span>
              </button>

              <button
                onClick={() => setActiveTab("browse")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "browse"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Drive Files ({files.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("custom")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "custom"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Upload Custom Note</span>
              </button>
            </div>

            {/* TAB 1: SAVE CURRENT SYLLABUS */}
            {activeTab === "save" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Exporting: {curriculum.title}
                    </h3>
                    <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Folder: Lukulu Academy Syllabi
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Uploads formatted Markdown (.md) or raw JSON data directly to your designated Google Drive folder.
                  </p>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-zinc-300">Select Export Format:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSaveFormat("both")}
                        className={`p-3 rounded-xl border text-xs text-left font-bold transition ${
                          saveFormat === "both"
                            ? "bg-blue-600/20 border-blue-500 text-blue-200"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Both (.MD + .JSON)</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-normal">Complete curriculum set</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSaveFormat("markdown")}
                        className={`p-3 rounded-xl border text-xs text-left font-bold transition ${
                          saveFormat === "markdown"
                            ? "bg-amber-500/20 border-amber-500 text-amber-200"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Markdown (.MD)</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-normal">Syllabus document</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSaveFormat("json")}
                        className={`p-3 rounded-xl border text-xs text-left font-bold transition ${
                          saveFormat === "json"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-200"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Structured JSON</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-normal">LMS schema format</p>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-zinc-900">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Destination: Google Drive / Lukulu Academy Syllabi
                    </span>

                    <button
                      onClick={handleSaveCurriculumToDrive}
                      disabled={isUploading}
                      className="py-2.5 px-5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving to Google Drive...</span>
                        </>
                      ) : (
                        <>
                          <HardDrive className="w-3.5 h-3.5" />
                          <span>Upload File(s) to Drive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {uploadSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{uploadSuccessMsg}</span>
                    </div>

                    <div className="space-y-1 pl-6">
                      {uploadedDriveLinks.map((f) => (
                        <div key={f.id} className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="font-mono text-[11px]">{f.name}</span>
                          {f.webViewLink && (
                            <a
                              href={f.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <span>Open in Google Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: BROWSE DRIVE FILES */}
            {activeTab === "browse" && (
              <div className="space-y-3">
                {/* Search & Create Folder Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-auto flex-1">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRefreshFiles()}
                      placeholder="Search files in Lukulu folder..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <form onSubmit={handleCreateFolder} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="New subfolder name..."
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 w-36"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingFolder || !newFolderName.trim()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Folder</span>
                    </button>
                  </form>

                  <button
                    onClick={handleRefreshFiles}
                    disabled={loadingFiles}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    title="Refresh Drive files"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? "animate-spin text-blue-400" : ""}`} />
                  </button>
                </div>

                {loadingFiles ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    Loading files from Google Drive...
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
                    No files found in the 'Lukulu Academy Syllabi' folder. Save your first syllabus above!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {files.map((file) => {
                      const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                      return (
                        <div
                          key={file.id}
                          className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                              {isFolder ? (
                                <Folder className="w-4 h-4 text-blue-400" />
                              ) : file.name.endsWith(".json") ? (
                                <FileCode className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <FileText className="w-4 h-4 text-amber-400" />
                              )}
                            </div>

                            <div>
                              <h4 className="font-bold text-xs text-zinc-100 flex items-center gap-2">
                                {file.name}
                              </h4>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                {file.modifiedTime
                                  ? `Modified: ${new Date(file.modifiedTime).toLocaleDateString()}`
                                  : "Google Drive Item"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setFileToDelete(file)}
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                              title="Delete File from Drive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                                title="Open in Google Drive"
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

            {/* TAB 3: UPLOAD CUSTOM NOTE */}
            {activeTab === "custom" && (
              <form onSubmit={handleUploadCustomFile} className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-200">
                    Upload Custom Text / Syllabus Document to Drive
                  </h3>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">File Name:</label>
                    <input
                      type="text"
                      required
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      placeholder="e.g. Lukulu-Mastering-Guide.txt"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Content / Document Notes:</label>
                    <textarea
                      rows={5}
                      required
                      value={customFileContent}
                      onChange={(e) => setCustomFileContent(e.target.value)}
                      placeholder="Enter syllabus notes, DAW plugin settings, or studio guidelines..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploadingCustom}
                      className="py-2 px-5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
                    >
                      {isUploadingCustom ? (
                        <span>Uploading File...</span>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File to Google Drive</span>
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
        {fileToDelete && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-zinc-100">
                  Confirm Delete File
                </h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to permanently delete <strong>"{fileToDelete.name}"</strong> from your Google Drive?
                This action mutates your Google Drive file storage.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
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
