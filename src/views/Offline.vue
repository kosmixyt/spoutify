<template>
    <div class="offline-view">
        <h1>Offline Music</h1>
        <div v-if="!isNativePlatform">
            <p>Offline mode is only available on native platforms.</p>
        </div>
        <div v-else>
            <div v-if="tracks.length === 0" class="empty-state">
                <p>No offline tracks available.</p>
            </div>
            <ul v-else>
                <li v-for="track in tracks" :key="track.id" class="track-item">
                    <div class="track-content">
                        <div class="track-thumbnail" v-if="track.cover">
                            <img :src="track.cover" alt="Track cover" />
                        </div>
                        <div class="track-info">
                            <h3>{{ track.title }}</h3>
                            <p>{{ track.artist }}</p>
                        </div>
                    </div>
                    <div class="track-actions">
                        <button @click="playTrack(track)" class="play-button">Play</button>
                        <button @click="deleteTrack(track)" class="delete-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Capacitor
} from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import router from '@/router';
import { toast } from 'vue3-toastify';

const isNativePlatform = Capacitor.isNativePlatform();
const tracks = ref<{
    id: string;
    title: string;
    artist: string;
    path: string;
    cover: string | null;
    artists?: Array<{ name: string, id: string | null }>;
    album?: any;
}[]>([]);

console.log(isNativePlatform)
const loadOfflineTracks = async () => {
    if (!isNativePlatform) return;

    try {
        console.log('Loading offline tracks...');
        const result = await Filesystem.readFile({
            path: 'offline_tracks.json',
            directory: Directory.Data,
        });
        console.log('Offline tracks loaded');
        const fromBase64 = atob(result.data as string);
        tracks.value = JSON.parse(fromBase64);
        console.log('Offline tracks loaded:', tracks.value);

        // Load thumbnails for each track
    } catch (error) {
        console.error('Error loading offline tracks:', error);
    }
};

const playTrack = async (track: typeof tracks.value[0]) => {
    if (!isNativePlatform) return;

    try {
        // Read the audio file
        const audioResult = await Filesystem.readFile({
            path: track.path,
            directory: Directory.Data,
        });

        // Create a player service request with the track data
        const audioData = audioResult.data as string;

        // Dispatch an event to play the track through GlobalAudioPlayer
        const playEvent = new CustomEvent('play-track', {
            detail: {
                videoId: null, // No video ID for offline tracks
                title: track.title,
                Artists: track.artists || [{ name: track.artist, id: null }],
                cover: track.cover || null,
                Album: track.album || null,
                audioBuffer: audioData, // Send the base64 audio data
                isOfflineTrack: true,
            }
        });

        window.dispatchEvent(playEvent);
    } catch (error) {
        console.error('Error playing track:', error);
    }
};

const deleteTrack = async (track: typeof tracks.value[0]) => {
    if (!isNativePlatform) return;

    if (!confirm(`Are you sure you want to delete "${track.title}"?`)) {
        return;
    }

    try {
        // Delete the audio file
        await Filesystem.deleteFile({
            path: track.path,
            directory: Directory.Data
        });

        // Update metadata to remove this track
        const metadataFile = "offline_tracks.json";
        const updatedTracks = tracks.value.filter(t => t.id !== track.id);

        // Save updated metadata
        const base64Metadata = btoa(JSON.stringify(updatedTracks));
        await Filesystem.writeFile({
            path: metadataFile,
            data: base64Metadata,
            directory: Directory.Data,
        });

        // Update local state
        tracks.value = updatedTracks;

        // Show success notification
        toast.success(`"${track.title}" has been deleted`);

    } catch (error) {
        console.error('Error deleting track:', error);
        toast.error("Failed to delete track");
    }
};

onMounted(() => {
    loadOfflineTracks();
});
</script>

<style scoped>
.offline-view {
    padding: 20px;
    color: white;
}

.track-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.track-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.track-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.track-thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    overflow: hidden;
    background: #333;
    flex-shrink: 0;
}

.track-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.track-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.track-info h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.track-info p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.track-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.play-button,
.delete-button {
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.play-button {
    background: #6C63FF;
    color: white;
}

.play-button:hover {
    background: #8075FF;
}

.delete-button {
    background: rgba(255, 59, 48, 0.1);
    color: #FF3B30;
}

.delete-button:hover {
    background: rgba(255, 59, 48, 0.2);
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: rgba(255, 255, 255, 0.7);
}
</style>