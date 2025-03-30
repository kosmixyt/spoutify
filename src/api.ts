import JSZip from "jszip";
import type {
  Album,
  AlbumData,
  Artist,
  Home,
  MainArtist,
  SearchItem,
  Thumbnail,
} from "./type";

import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { toast } from "vue3-toastify";
import router from "./router";

export const app_url = "https://uw4s8co8wgkkg8g004cs8os8.kosmix.me";

export var token = localStorage.getItem("token") || "";
export async function getToken(
  username?: string,
  password?: string
): Promise<string> {
  const res = await fetch(`${app_url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      username && password
        ? new URLSearchParams({
            username,
            password,
          })
        : undefined,
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  if (data.access_token) {
    token = data.access_token;
    localStorage.setItem("token", token);
  }
  return data.access_token;
}

export function logout() {
  localStorage.removeItem("token");
  token = "";
  router.push("/login");
}

// Check if we have a valid token
export function checkAuthStatus(): boolean {
  return !!localStorage.getItem("token");
}

// Handle API calls with automatic authentication handling
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!token) {
    token = localStorage.getItem("token") || "";
  }

  // Add the auth header if we have a token
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    logout();
    throw new Error("Authentication required. Please log in again.");
  }

  return response;
}

export async function GetHome(): Promise<Home> {
  try {
    const res = await authenticatedFetch(`${app_url}/home`);
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data as Home;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Authentication required")
    ) {
      router.push("/login");
    }
    throw error;
  }
}

export async function DownloadAlbum(
  data: AlbumData,
  name: string,
  progress: (c: number, t: number) => void
) {
  if (!Capacitor.isNativePlatform()) {
    const zip = new JSZip();
    const folder = zip.folder(name);
    if (!folder) {
      throw new Error("Failed to create folder in zip");
    }
    const tracks = data.tracks || [];
    const totalTracks = tracks.length;
    let downloadedTracks = 0;

    for (const track of tracks) {
      progress(downloadedTracks, totalTracks);
      const res = await authenticatedFetch(
        `${app_url}/stream/${track.videoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const contentLength = res.headers.get("Content-Length");
      const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedSize = 0;

      const reader = res.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedSize += value.length;
          const progress = totalSize ? (receivedSize / totalSize) * 100 : 0;
          console.log(`Downloading: ${Math.round(progress)}%`);
        }
      }

      const blob = new Blob(chunks, { type: "audio/mpeg" });
      folder.file(`${track.title}.mp3`, blob);
      downloadedTracks++;
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${name}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  }
  const tracks = data.tracks || [];
  const totalTracks = tracks.length;
  let downloadedTracks = 0;
  const toastId = toast(
    "Téléchargement de l'album en cours ne quittez pas...",
    {
      autoClose: false,
      isLoading: true,
    }
  );
  for (const track of tracks) {
    await Download(
      track.videoId,
      track.title,
      getBestQualitythumbnail(data.thumbnails).url,
      track.artists,
      data
    );
    downloadedTracks++;
  }
  progress(downloadedTracks, totalTracks);
  toast.update(toastId, {
    render: "Téléchargement terminé !",
    type: "success",
    autoClose: 3000,
    isLoading: false,
  });
}

export async function Download(
  id: string,
  name: string,
  thumbnail_url: string,
  artists = null,
  album = null
) {
  const toastId = toast("Téléchargement en cours...", {
    autoClose: false,
    isLoading: true,
  });

  try {
    const res = await authenticatedFetch(`${app_url}/stream/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const contentLength = res.headers.get("Content-Length");
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
    let receivedSize = 0;

    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];

    // Affiche un toast de progression
    if (reader) {
      let lastPercent = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedSize += value.length;

        const progress = totalSize ? (receivedSize / totalSize) * 100 : 0;
        console.log(receivedSize, totalSize);
        console.log(`Downloading: ${Math.round(progress)}%`);
        if (Math.round(progress) - lastPercent > 5) {
          lastPercent = Math.round(progress);
          toast.update(toastId, {
            render: `Téléchargement en cours... ${Math.round(progress)}%`,
            type: "info",
            isLoading: true,
          });
        }
      }
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });

    if (Capacitor.isNativePlatform()) {
      // Get the track details to fetch the thumbnail
      try {
        const res = await fetch(thumbnail_url, {});
        const thumbnailBlob = await res.blob();
        const thumbnailBase64 = await blobToBase64(thumbnailBlob);
        const thumbnailData = `data:image/jpeg;base64,${thumbnailBase64}`;
        await saveOfflineTrack(
          id,
          name,
          "Unknown Artist",
          blob,
          thumbnailData,
          artists,
          album
        );
      } catch (error) {
        console.error("Error saving offline track:", error);
        toast.update(toastId, {
          render: "Erreur lors de la sauvegarde hors ligne",
          type: "error",
          autoClose: 3000,
          isLoading: false,
        });
        return;
      }

      toast.update(toastId, {
        render: "Téléchargement terminé et sauvegardé hors ligne !",
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });
    } else {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${name}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log("Download complete", toastId);
      toast.update(toastId, {
        render: "Téléchargement terminé !",
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Authentication required")
    ) {
      toast.update(toastId, {
        render: "Session expired, please log in again",
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
      router.push("/login");
      return;
    }

    toast.update(toastId, {
      render: "Error downloading file",
      type: "error",
      autoClose: 3000,
      isLoading: false,
    });
    console.error(error);
  }
}

export async function GetArtist(id: string): Promise<MainArtist> {
  try {
    const res = await authenticatedFetch(`${app_url}/artist/${id}`);
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data as MainArtist;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Authentication required")
    ) {
      router.push("/login");
    }
    throw error;
  }
}

export function getLargestThumbnail(thumbnails: Thumbnail[]): string {
  let largest = 0;
  let largestUrl = "";
  for (const thumbnail of thumbnails) {
    if (thumbnail.width > largest) {
      largest = thumbnail.width;
      largestUrl = thumbnail.url;
    }
  }
  return largestUrl;
}
export async function GetAlbum(id: string) {
  const res = await authenticatedFetch(`${app_url}/album/${id}`);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as AlbumData;
}
export async function GetPlaylist(id: string): Promise<AlbumData> {
  const res = await authenticatedFetch(`${app_url}/playlist/${id}`);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}
export function getBestQualitythumbnail(thumbnails: Thumbnail[]): Thumbnail {
  let largest = 0;
  let largestUrl = "";
  let largestThumbnail: Thumbnail = { url: "", width: 0, height: 0 };
  for (const thumbnail of thumbnails) {
    if (thumbnail.width > largest) {
      largest = thumbnail.width;
      largestUrl = thumbnail.url;
      largestThumbnail = thumbnail;
    }
  }
  return largestThumbnail;
}
export async function Search(
  query: string,
  filter: string
): Promise<SearchItem[]> {
  const res = await authenticatedFetch(`${app_url}/search?query=${query}`);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as SearchItem[];
}

export async function GetLyrics(videoId: string): Promise<string> {
  const res = await authenticatedFetch(`${app_url}/lyrics/${videoId}`);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as string;
}

export async function saveOfflineTrack(
  id: string,
  title: string,
  artist: string,
  audioBlob: Blob,
  thumbnailBase64: string | null = null,
  artistsData = null,
  albumData = null
) {
  const fileName = `${id}.mp3`;
  const metadataFile = "offline_tracks.json";

  // Save audio file
  const base64Data = await blobToBase64(audioBlob);
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  });

  // Save metadata
  let metadata = [];
  try {
    const result = await Filesystem.readFile({
      path: metadataFile,
      directory: Directory.Data,
    });

    // Properly decode the base64 string before parsing JSON
    try {
      // First try direct JSON parsing in case it's not base64 encoded
      metadata = JSON.parse(result.data as string);
    } catch (e) {
      // If direct parsing fails, try decoding from base64
      try {
        const jsonString = atob(result.data as string);
        metadata = JSON.parse(jsonString);
      } catch (e2) {
        console.error("Failed to parse metadata:", e2);
        // If both methods fail, start with an empty array
        metadata = [];
      }
    }
  } catch (e) {
    console.log("No existing metadata file, creating new one");
    // Metadata file doesn't exist, create a new one
  }

  // Check if track already exists, update it instead of adding duplicate
  const existingIndex = metadata.findIndex((track: any) => track.id === id);
  if (existingIndex >= 0) {
    metadata[existingIndex] = {
      id,
      title,
      artist,
      path: fileName,
      cover: thumbnailBase64,
      artists: artistsData || [{ name: artist, id: null }],
      album: albumData || null,
    };
  } else {
    // Add new track metadata
    metadata.push({
      id,
      title,
      artist,
      path: fileName,
      cover: thumbnailBase64,
      artists: artistsData || [{ name: artist, id: null }],
      album: albumData || null,
    });
  }

  // to base64
  const base64Metadata = btoa(JSON.stringify(metadata));
  await Filesystem.writeFile({
    path: metadataFile,
    data: base64Metadata,
    directory: Directory.Data,
  });

  console.log(
    `Saved track "${title}" to offline storage. Total tracks: ${metadata.length}`
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Base64 prefix (e.g., "data:audio/mpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
