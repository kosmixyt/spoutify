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
                    <button @click="playTrack(track)" class="play-button">Play</button>
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

const isNativePlatform = Capacitor.isNativePlatform();
const tracks = ref<{
    id: string;
    title: string;
    artist: string;
    path: string;
    cover: string | null;
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
                Artists: [{ name: track.artist, id: null }],
                cover: track.cover || null,
                audioBuffer: audioData, // Send the base64 audio data
                isOfflineTrack: true,
            }
        });

        window.dispatchEvent(playEvent);
    } catch (error) {
        console.error('Error playing track:', error);
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

.play-button {
    background: #6C63FF;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.play-button:hover {
    background: #8075FF;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: rgba(255, 255, 255, 0.7);
}
</style>