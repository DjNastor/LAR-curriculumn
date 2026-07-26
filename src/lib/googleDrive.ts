import { Curriculum } from "../types";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

/**
 * Search for or create the dedicated 'Lukulu Academy Syllabi' folder in Google Drive
 */
export async function getOrCreateLukuluFolder(accessToken: string): Promise<string> {
  const query = "mimeType = 'application/vnd.google-apps.folder' and name = 'Lukulu Academy Syllabi' and trashed = false";
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name)`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to search Google Drive folders");
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Folder does not exist, create it
  const createResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Lukulu Academy Syllabi",
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  if (!createResponse.ok) {
    const errData = await createResponse.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to create Google Drive folder");
  }

  const newFolder = await createResponse.json();
  return newFolder.id;
}

/**
 * List files from Google Drive (optionally restricted to a folder or query)
 */
export async function listDriveFiles(
  accessToken: string,
  folderId?: string,
  searchQuery?: string
): Promise<DriveFile[]> {
  let queryParts: string[] = ["trashed = false"];

  if (folderId) {
    queryParts.push(`'${folderId}' in parents`);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    queryParts.push(`name contains '${searchQuery.replace(/'/g, "\\'")}'`);
  }

  const q = queryParts.join(" and ");
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,webViewLink,webContentLink,createdTime,modifiedTime,size)&orderBy=modifiedTime desc&pageSize=50`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to list Google Drive files");
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload a text/JSON/markdown file to Google Drive using Multipart Upload API
 */
export async function uploadFileToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string,
  folderId?: string
): Promise<DriveFile> {
  const boundary = "------LukuluAcademyDriveBoundary" + Date.now();
  const metadata: any = {
    name: fileName,
    mimeType: mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const multipartRequestBody =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,createdTime,modifiedTime",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to upload file to Google Drive");
  }

  return await response.json();
}

/**
 * Delete a file from Google Drive
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<boolean> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to delete Google Drive file");
  }

  return true;
}

/**
 * Create a custom folder in Google Drive
 */
export async function createDriveFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const metadata: any = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to create folder in Google Drive");
  }

  return await response.json();
}

/**
 * Helper to upload full curriculum as Markdown & JSON files to Drive
 */
export async function uploadCurriculumToDrive(
  accessToken: string,
  curriculum: Curriculum,
  format: "markdown" | "json" | "both"
): Promise<{ filesUploaded: DriveFile[]; folderId: string }> {
  const folderId = await getOrCreateLukuluFolder(accessToken);
  const filesUploaded: DriveFile[] = [];

  const sanitizedDaw = curriculum.trackDaw.replace(/\s+/g, "-");
  const sanitizedGenre = curriculum.genre.replace(/\s+/g, "-");

  if (format === "markdown" || format === "both") {
    const mdFileName = `Lukulu-Academy-${sanitizedDaw}-${sanitizedGenre}-Curriculum.md`;
    const mdFile = await uploadFileToDrive(
      accessToken,
      mdFileName,
      curriculum.markdownSyllabus,
      "text/markdown",
      folderId
    );
    filesUploaded.push(mdFile);
  }

  if (format === "json" || format === "both") {
    const jsonFileName = `Lukulu-Academy-${sanitizedDaw}-${sanitizedGenre}-Syllabus.json`;
    const jsonFile = await uploadFileToDrive(
      accessToken,
      jsonFileName,
      JSON.stringify(curriculum, null, 2),
      "application/json",
      folderId
    );
    filesUploaded.push(jsonFile);
  }

  return { filesUploaded, folderId };
}
