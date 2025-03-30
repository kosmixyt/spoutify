import type { Album, Artist } from "@/type";

/**
 * Player service for interacting with the GlobalAudioPlayer
 */
export interface PlayerServiceRequest {
  videoId: string;
  Artists: Artist[];
  Album?: Album;
  title: string;
  cover: string;
}

/**
 * Play a track in the global audio player
 *
 * @param track The track to play
 */
export function playTrack(track: PlayerServiceRequest): void {
  // Dispatch a custom event to communicate with the GlobalAudioPlayer
  window.dispatchEvent(new CustomEvent("play-track", { detail: track }));
}

/**
 * Play multiple tracks as a playlist
 *
 * @param tracks The tracks to add to the playlist
 * @param startIndex The index of the track to start playing (default: 0)
 */
export function playPlaylist(
  tracks: PlayerServiceRequest[],
  startIndex = 0
): void {
  if (tracks.length === 0) return;

  // First play the selected track
  playTrack(tracks[startIndex]);

  // Then dispatch a playlist event (optional, to be implemented if needed)
  window.dispatchEvent(
    new CustomEvent("set-playlist", {
      detail: { tracks, currentIndex: startIndex },
    })
  );
}

// Add to queue function
export function addToQueue(track: PlayerServiceRequest) {
  // Create a custom event for adding to queue
  const event = new CustomEvent("add-to-queue", { detail: track });
  // Dispatch the event
  window.dispatchEvent(event);
}
