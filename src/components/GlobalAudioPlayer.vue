<template>
    <div class="player-container " :class="{ 'mobile-view': isMobileView }">
        <!-- Desktop player (unchanged for larger screens) -->
        <div class="desktop-player" v-if="!isMobileView">
            <div class="track-info">
                <div class="cover-container" v-if="currentTrack">
                    <img :src="currentTrack.cover" alt="Cover" class="cover-image" />
                </div>
                <div class="track-details">
                    <div v-if="currentTrack">
                        <router-link class="track-title">
                            {{ currentTrack.title }}
                        </router-link>
                    </div>
                    <div v-if="currentTrack">
                        <router-link v-for="artist in currentTrack.Artists" :to="'/artist/' + artist.id"
                            class="track-artist mr-1">
                            {{ artist.name }}
                        </router-link>
                    </div>
                    <div v-if="currentTrack">
                        <router-link v-if="currentTrack.Album" :to="'/album/' + currentTrack.Album?.id"
                            class="track-album">
                            {{ currentTrack.Album?.name }}
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="playback-controls">
                <div class="control-buttons">
                    <button @click="previousTrack" class="control-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                        </svg>
                    </button>
                    <button @click="togglePlay" class="play-btn">
                        <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <button @click="nextTrack" class="control-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                    </button>
                </div>
                <div class="progress-container">
                    <span class="time-display">{{ formatTime(currentTime) }}</span>
                    <div class="progress-bar-wrapper">
                        <input type="range" class="progress-bar " min="0" :max="duration" step="0.1"
                            v-model="currentTime" @input="seek" />
                        <div class="progress-bar-fill" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
                    </div>
                    <span class="time-display">{{ formatTime(duration) }}</span>
                </div>
            </div>

            <div class="volume-controls">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path v-if="volume > 0.5"
                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    <path v-else-if="volume > 0"
                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path v-else
                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
                <div class="volume-slider-wrapper">
                    <input type="range" class="volume-slider" min="0" max="1" step="0.01" v-model="volume"
                        @input="changeVolume" />
                    <div class="volume-slider-fill" :style="{ width: `${volume * 100}%` }"></div>
                </div>
            </div>
        </div>

        <!-- Mobile player (Spotify style) -->
        <div class="spotify-mobile-player" v-if="isMobileView">
            <!-- Mini player (collapsed state) -->
            <div class="mini-player" v-if="!expandedPlayer" @click="expandPlayer">
                <div class="mini-player-progress">
                    <div class="mini-progress-fill" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
                </div>
                <div class="mini-player-content">
                    <div class="mini-cover" v-if="currentTrack">
                        <img :src="currentTrack.cover" alt="Cover" />
                    </div>
                    <div class="mini-track-info">
                        <div class="mini-title" v-if="currentTrack">{{ currentTrack.title }}</div>
                        <div class="mini-artist"
                            v-if="currentTrack && currentTrack.Artists && currentTrack.Artists.length">
                            {{currentTrack.Artists.map(a => a.name).join(', ')}}
                        </div>
                    </div>
                    <div class="mini-controls">
                        <button @click.stop="togglePlay" class="mini-play-btn">
                            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                        <button @click.stop="nextTrack" class="mini-next-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Full screen player (expanded state) -->
            <div class="full-player " v-if="expandedPlayer">
                <div class="full-player-header">
                    <button @click="collapsePlayer" class="down-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                    </button>
                    <div class="now-playing">Now Playing</div>
                    <div class="menu-dots">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </div>
                </div>

                <div class="full-cover-art" v-if="currentTrack">
                    <img :src="currentTrack.cover" alt="Cover" />
                </div>

                <div class="full-track-details">
                    <div class="full-title" v-if="currentTrack">{{ currentTrack.title }}</div>
                    <div class="full-artist" v-if="currentTrack && currentTrack.Artists && currentTrack.Artists.length">
                        {{currentTrack.Artists.map(a => a.name).join(', ')}}
                    </div>
                </div>

                <div class="full-progress-bar">
                    <div class="progress-bar-wrapper">
                        <input type="range" class="progress-bar" min="0" :max="duration" step="0.1"
                            v-model="currentTime" @input="seek" />
                        <div class="progress-bar-fill" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
                    </div>
                    <div class="time-labels">
                        <span class="time-display">{{ formatTime(currentTime) }}</span>
                        <span class="time-display">{{ formatTime(duration) }}</span>
                    </div>
                </div>

                <div class="full-player-controls">
                    <button class="shuffle-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                        </svg>
                    </button>
                    <button @click="previousTrack" class="prev-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                        </svg>
                    </button>
                    <button @click="togglePlay" class="full-play-btn">
                        <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <button @click="nextTrack" class="next-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                    </button>
                    <button class="repeat-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { app_url } from '@/api';
import type { PlayerServiceRequest } from '@/services/playerService';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'GlobalAudioPlayer',
    data() {
        return {
            audio: new Audio(),
            isPlaying: false,
            currentTrack: null as PlayerServiceRequest | null,
            currentTime: 0,
            duration: 0,
            volume: 1,
            currentTrackIndex: 0,
            isMobileView: false,
            expandedPlayer: false
        };
    },
    created() {
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
        });

        this.audio.addEventListener('ended', this.nextTrack);

        // Register this component to receive play requests
        window.addEventListener('play-track', this.handlePlayRequest as EventListener);

        // Check for mobile view
        this.checkMobileView();
        window.addEventListener('resize', this.checkMobileView);
    },

    beforeUnmount() {
        // Clean up event listener
        window.removeEventListener('play-track', this.handlePlayRequest as EventListener);
        window.removeEventListener('resize', this.checkMobileView);
    },
    methods: {
        playTrack(track: PlayerServiceRequest) {
            this.currentTime = 0;
            this.duration = 0;
            this.audio.src = `${app_url}/stream/${track.videoId}`
            this.audio.load();
            this.currentTrack = track;
            this.audio.play();
            this.isPlaying = true;
        },
        togglePlay() {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
        },
        seek(event: Event) {
            const target = event.target as HTMLInputElement;
            this.audio.currentTime = parseFloat(target.value);
        },
        formatTime(time: number) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        },
        changeVolume(event: Event) {
            const target = event.target as HTMLInputElement;
            this.audio.volume = parseFloat(target.value);
        },
        previousTrack() {

        },
        nextTrack() {
        },
        handlePlayRequest(event: CustomEvent) {

            const track = event.detail;

            this.playTrack(track)
        },
        // Mobile player methods
        checkMobileView() {
            this.isMobileView = window.innerWidth < 768;
            if (!this.isMobileView) {
                this.expandedPlayer = false;
            }
        },
        expandPlayer() {
            this.expandedPlayer = true;
            document.body.classList.add('player-expanded');
        },
        collapsePlayer() {
            this.expandedPlayer = false;
            document.body.classList.remove('player-expanded');
        }
    }
})
</script>

<style scoped>
/* Desktop player styles */
.player-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to right, #121212, #1A1A1A, #121212);
    color: #ffffff;
    z-index: 50;
}

.player-container.mobile-view {
    background: transparent;
}

.desktop-player {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
}

.track-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 30%;
    min-width: 200px;
}

.cover-container {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
}

.cover-image {
    width: 3.5rem;
    height: 3.5rem;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.track-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-width: 100%;
}

.track-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #ffffff;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;
    display: block;
}

.track-title:hover {
    color: #6C63FF;
}

.track-artist {
    font-size: 0.85rem;
    color: #B3B3B3;
    text-decoration: none;
    transition: color 0.2s ease;
    margin-top: 0.2rem;
}

.track-artist:hover {
    color: #ffffff;
    text-decoration: underline;
}

.track-album {
    font-size: 0.75rem;
    color: #828282;
    text-decoration: none;
    transition: color 0.2s ease;
    margin-top: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.track-album:hover {
    color: #B3B3B3;
    text-decoration: underline;
}

.playback-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 40%;
    flex-grow: 1;
}

.control-buttons {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.control-btn {
    background: transparent;
    border: none;
    color: #B3B3B3;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    color: #ffffff;
    transform: scale(1.1);
}

.play-btn {
    background: #6C63FF;
    border: none;
    color: #ffffff;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(108, 99, 255, 0.5);
}

.play-btn:hover {
    background: #7B74FF;
    transform: scale(1.05);
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.time-display {
    font-size: 0.7rem;
    color: #B3B3B3;
    min-width: 2.5rem;
}

.progress-bar-wrapper {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: #535353;
    border-radius: 2px;
}

.progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    appearance: none;
    background: transparent;
    margin: 0;
    z-index: 2;
    cursor: pointer;
    opacity: 0;
}

.progress-bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #6C63FF;
    border-radius: 2px;
    pointer-events: none;
}

.volume-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 20%;
    min-width: 120px;
    justify-content: flex-end;
}

.volume-slider-wrapper {
    position: relative;
    width: 100px;
    height: 4px;
    background-color: #535353;
    border-radius: 2px;
}

.volume-slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    appearance: none;
    background: transparent;
    margin: 0;
    z-index: 2;
    cursor: pointer;
    opacity: 0;
}

.volume-slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #6C63FF;
    border-radius: 2px;
    pointer-events: none;
}

.progress-bar::-webkit-slider-thumb,
.volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
}

.progress-bar-wrapper:hover .progress-bar::-webkit-slider-thumb,
.volume-slider-wrapper:hover .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #6C63FF;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(108, 99, 255, 0.7);
    opacity: 1;
}

.progress-bar-wrapper:hover .progress-bar-fill,
.volume-slider-wrapper:hover .volume-slider-fill {
    background-color: #7B74FF;
}

/* Ensure the thumb is visible when hovering */
.progress-bar:hover::-webkit-slider-thumb,
.volume-slider:hover::-webkit-slider-thumb {
    opacity: 1;
}

/* Firefox support */
.progress-bar::-moz-range-thumb,
.volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0;
}

.progress-bar-wrapper:hover .progress-bar::-moz-range-thumb,
.volume-slider-wrapper:hover .volume-slider::-moz-range-thumb {
    background: #6C63FF;
    opacity: 1;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(108, 99, 255, 0.7);
}

@media (max-width: 768px) {
    .player-container {
        flex-direction: column;
        padding: 1rem 0.75rem;
        gap: 0.75rem;
        height: auto;
    }

    .track-info,
    .playback-controls,
    .volume-controls {
        width: 100%;
    }

    .track-info {
        order: 1;
        justify-content: flex-start;
    }

    .playback-controls {
        order: 2;
    }

    .volume-controls {
        order: 3;
        justify-content: center;
        margin-top: 0.25rem;
    }

    .cover-image {
        width: 2.75rem;
        height: 2.75rem;
    }

    .track-details {
        max-width: calc(100% - 3.5rem);
    }

    .control-buttons {
        gap: 1rem;
    }

    .play-btn {
        width: 2.25rem;
        height: 2.25rem;
    }

    .progress-container {
        padding: 0 0.25rem;
    }

    .time-display {
        min-width: 2.25rem;
    }
}

@media (max-width: 480px) {
    .player-container {
        padding: 0.75rem 0.5rem;
    }

    .track-info {
        min-width: 0;
    }

    .control-buttons {
        gap: 0.75rem;
    }

    .volume-slider-wrapper {
        width: 70px;
    }

    .time-display {
        font-size: 0.65rem;
        min-width: 2rem;
    }
}

/* For very small screens */
@media (max-width: 360px) {
    .cover-image {
        width: 2.5rem;
        height: 2.5rem;
    }

    .track-title,
    .track-artist,
    .track-album {
        max-width: 100%;
    }

    .control-btn {
        padding: 0.35rem;
    }

    .play-btn {
        width: 2rem;
        height: 2rem;
    }
}

/* Spotify Mobile Player Styles */
.spotify-mobile-player {
    width: 100%;
}

/* Mini Player Styles */
.mini-player {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #1A1A1A;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.mini-player-progress {
    height: 2px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 0;
    left: 0;
}

.mini-progress-fill {
    height: 100%;
    background-color: #6C63FF;
}

.mini-player-content {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    gap: 12px;
}

.mini-cover {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
}

.mini-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.mini-track-info {
    flex: 1;
    overflow: hidden;
    padding-right: 8px;
}

.mini-title {
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mini-artist {
    font-size: 12px;
    color: #b3b3b3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mini-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.mini-play-btn,
.mini-next-btn {
    background: transparent;
    border: none;
    color: #fff;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* Full Screen Player Styles */
.full-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #1a1a1a 0%, #121212 100%);
    z-index: 100;
    display: flex;
    flex-direction: column;
    padding: 32px 24px;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.full-player-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 0 8px;
}

.down-arrow,
.menu-dots {
    background: transparent;
    border: none;
    color: #fff;
    padding: 8px;
    cursor: pointer;
}

.now-playing {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.full-cover-art {
    width: 100%;
    max-width: 320px;
    margin: 0 auto 32px;
    aspect-ratio: 1;
    box-shadow: 0 20px 40px rgba(108, 99, 255, 0.2);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.full-cover-art::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, rgba(26, 26, 26, 0) 100%);
    pointer-events: none;
}

.full-cover-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    transform: scale(1.02);
    transition: transform 0.3s ease;
}

.full-track-details {
    text-align: center;
    margin-bottom: 32px;
    padding: 0 16px;
    position: relative;
}

.full-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
}

.full-artist {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.full-progress-bar {
    margin: 0 auto 40px;
    padding: 0 16px;
    width: 100%;
    max-width: 480px;
}

.full-progress-bar .progress-bar-wrapper {
    height: 4px;
    margin-bottom: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.time-labels {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 500;
}

.full-player-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 320px;
    margin: 0 auto;
    padding: 0 16px;
}

.shuffle-btn,
.prev-btn,
.next-btn,
.repeat-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 12px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.shuffle-btn:hover,
.prev-btn:hover,
.next-btn:hover,
.repeat-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}

.full-play-btn {
    background: #6C63FF;
    border: none;
    color: #fff;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(108, 99, 255, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.full-play-btn::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
}

.full-play-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 36px rgba(108, 99, 255, 0.5);
    background: #7B74FF;
}

.full-play-btn:active {
    transform: scale(0.98);
}

.full-player .progress-bar {
    opacity: 0.8;
    /* More visible on mobile */
}

.full-player .progress-bar-fill {
    background-color: #6C63FF;
}

/* Add this to your existing media queries */
@media (max-width: 768px) {
    .player-container:not(.mobile-view) {
        display: none;
    }
}

/* Small mobile adjustments */
@media (max-width: 360px) {
    .full-cover-art {
        max-width: 240px;
    }

    .full-title {
        font-size: 20px;
    }

    .full-play-btn {
        width: 56px;
        height: 56px;
    }
}
</style>
