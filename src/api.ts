import JSZip from "jszip";
import type {
  Album,
  AlbumData,
  Artist,
  MainArtist,
  SearchItem,
  Thumbnail,
} from "./type";

export const app_url = "http://192.168.1.51:8000";

export var token = "";
export async function getToken(): Promise<string> {
  const res = await fetch(`${app_url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: "newuser@example.com",
      password: "newpassword123",
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  if (data.access_token) {
    token = data.access_token;
  }
  return data.access_token;
}

export async function GetHome() {
  const res = await fetch(`${app_url}/home`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as AlbumData[];
}

export async function DownloadAlbum(
  data: AlbumData,
  name: string,
  progress: (c: number, t: number) => void
) {
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
    const res = await fetch(`${app_url}/stream/${track.videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
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
}

export async function Download(id: string, name: string) {
  const res = await fetch(`${app_url}/stream/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

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
      // Update notification (you can customize this part)
      console.log(`Downloading: ${Math.round(progress)}%`);
    }
  }

  const blob = new Blob(chunks, { type: "audio/mpeg" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${name}.mp3`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function GetArtist(id: string): Promise<MainArtist> {
  const res = await fetch(`${app_url}/artist/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as MainArtist;
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
  const res = await fetch(`${app_url}/album/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as AlbumData;
}
export async function GetPlaylist(id: string): Promise<AlbumData> {
  const res = await fetch(`${app_url}/playlist/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
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
  const res = await fetch(`${app_url}/search?query=${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as SearchItem[];
}

export async function GetLyrics(videoId: string): Promise<string> {
  const res = await fetch(`${app_url}/lyrics/${videoId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as string;
}
