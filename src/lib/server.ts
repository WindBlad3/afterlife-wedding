import { readFile } from 'fs/promises';
import path from 'path';
import { google } from 'googleapis';

// Written once by `npm run drive:connect` (scripts/connect-drive.mjs).
const STORE = path.join(process.cwd(), '.data', 'google.json');

type Conn = { refreshToken: string; folderId: string };

// Falls back to env vars for hosts without a persistent disk.
async function getConnection(): Promise<Conn | null> {
  try {
    return JSON.parse(await readFile(STORE, 'utf8'));
  } catch {
    const { GOOGLE_REFRESH_TOKEN: refreshToken, GOOGLE_DRIVE_FOLDER_ID: folderId } = process.env;
    return refreshToken && folderId ? { refreshToken, folderId } : null;
  }
}

export async function getDrive() {
  const conn = await getConnection();
  if (!conn) return null;
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: conn.refreshToken });
  const drive = google.drive({ version: 'v3', auth });
  return { drive, auth, folderId: conn.folderId, photosFolder: () => getPhotosFolder(drive, conn.folderId) };
}

type Drive = ReturnType<typeof google.drive>;

// "Fotos" inside the main folder, found or created on first use.
// Cached as a promise so concurrent first uploads on the same instance don't create duplicates.
let photos: Promise<string> | null = null;

function getPhotosFolder(drive: Drive, parent: string) {
  photos ??= (async () => {
    const name = 'Fotos';
    const { data } = await drive.files.list({
      q: `'${parent}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id)',
    });
    if (data.files?.[0]?.id) return data.files[0].id;
    const created = await drive.files.create({
      requestBody: { name, parents: [parent], mimeType: 'application/vnd.google-apps.folder' },
      fields: 'id',
    });
    return created.data.id!;
  })().catch(err => {
    photos = null; // retry next time instead of caching the failure
    throw err;
  });
  return photos;
}
