// Photos only. The browser re-encodes each photo to "2K" (2560 px longest side, JPEG) before upload,
// typically ~0.5–2 MB, so 15 GB fits far more than maxPhotos.
// photoBytes stays under Vercel's 4.5 MB request-body limit, so each photo goes in a single request.
const MB = 1024 * 1024;

export const LIMITS = {
  maxPhotos: 1000,
  photoSourceBytes: 40 * MB, // original picked by the guest, before compression
  photoBytes: 4 * MB, // after compression
  photoMaxSide: 2560, // px, longest side ("2K")
  photoQualities: [0.85, 0.75, 0.6], // tried in order until it fits photoBytes
  reserveBytes: 200 * MB, // minimal safety margin, never fill the Drive past this
};

export const mb = (bytes: number) => `${Math.round(bytes / MB)} MB`;

const VIDEO_EXT = /\.(mov|mp4|m4v|webm|3gp|mkv|avi)$/i;

/** True for real photos. Phones sometimes report videos (e.g. iPhone .MOV) with an image type. */
export const isPhoto = (name: string, type: string) => type.startsWith('image/') && !VIDEO_EXT.test(name);
