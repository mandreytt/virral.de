import { createHash } from "crypto";

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_API_KEY!;
const TOKEN_AUTH_KEY = process.env.BUNNY_TOKEN_AUTH_KEY!;

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Signierte Embed-URL für den Bunny-Player.
 * Voraussetzung: "Embed View Token Authentication" ist in der Library
 * unter Security aktiviert – ohne Token ist das Video dann nicht abrufbar.
 */
export function getSignedEmbedUrl(videoId: string, ttlSeconds = 6 * 3600) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const token = sha256Hex(TOKEN_AUTH_KEY + videoId + expires);
  return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=false`;
}

/** Neues (leeres) Video in der Library anlegen; liefert die Video-GUID. */
export async function createBunnyVideo(title: string): Promise<string> {
  const res = await fetch(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
    {
      method: "POST",
      headers: {
        AccessKey: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    }
  );
  if (!res.ok) {
    throw new Error(`Bunny: Video konnte nicht angelegt werden (${res.status})`);
  }
  const data = (await res.json()) as { guid: string };
  return data.guid;
}

/** Signatur für den direkten TUS-Upload aus dem Browser zu Bunny. */
export function getTusUploadAuth(videoId: string, ttlSeconds = 6 * 3600) {
  const expiration = Math.floor(Date.now() / 1000) + ttlSeconds;
  const signature = sha256Hex(LIBRARY_ID + API_KEY + expiration + videoId);
  return {
    endpoint: "https://video.bunnycdn.com/tusupload",
    signature,
    expiration,
    libraryId: LIBRARY_ID,
    videoId,
  };
}

/** Video bei Bunny löschen (z.B. wenn eine Lektion entfernt wird). */
export async function deleteBunnyVideo(videoId: string) {
  await fetch(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
    { method: "DELETE", headers: { AccessKey: API_KEY } }
  );
}
