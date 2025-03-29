<template>
    <div class="player-container " :class="{ 'mobile-view': isMobileView }">
        <!-- Desktop player (unchanged for larger screens) -->
        <div class="desktop-player" v-if="!isMobileView">
            <div class="track-info">
                <div class="cover-container" v-if="currentTrack">
                    <img :src="currentTrack.cover" alt="Cover" class="cover-image" @click="openImageModal" />
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
                <!-- Lyrics button for desktop -->
                <button @click="toggleLyrics" class="lyrics-btn" :class="{ 'active': showLyrics }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                        <path d="M9 13h6v2H9zM9 9h4v2H9zM9 17h6v2H9z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Lyrics panel for desktop -->
        <div class="lyrics-panel" v-if="!isMobileView && showLyrics && !showFullLyrics" style="display: none;">
            <div class="lyrics-header">
                <h3>Lyrics</h3>
                <div class="lyrics-controls">
                    <button @click="toggleFullLyrics" class="expand-lyrics">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                        </svg>
                    </button>
                    <button @click="toggleLyrics" class="close-lyrics">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="lyrics-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula
                    elementum sed sit amet dui.</p>
                <p>Curabitur aliquet quam id dui posuere blandit. Vivamus magna justo, lacinia eget consectetur sed,
                    convallis at tellus.</p>
                <p>Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh
                    pulvinar a.</p>
                <p>Donec rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac
                    lectus.</p>
                <p>Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed
                    magna dictum porta.</p>
            </div>
        </div>

        <!-- Full-screen lyrics for desktop -->
        <div class="desktop-full-lyrics" v-if="!isMobileView && (showFullLyrics || lyricsExiting)"
            :class="{ 'lyrics-exit-animation': lyricsExiting }">
            <div class="desktop-full-lyrics-header">
                <div class="track-info-container" v-if="currentTrack">
                    <div class="track-cover">
                        <img :src="currentTrack.cover" alt="Cover" />
                    </div>
                    <div class="track-info-details">
                        <h2>{{ currentTrack.title }}</h2>
                        <p v-if="currentTrack.Artists && currentTrack.Artists.length">
                            {{currentTrack.Artists.map(a => a.name).join(', ')}}
                        </p>
                    </div>
                </div>
                <button @click="toggleFullLyrics" class="close-full-lyrics">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
            <h3 class="text-center text-2xl text-violet-700 font-semibold cursor-default">Lyrics</h3>

            <!-- Desktop lyrics content -->
            <div class="desktop-full-lyrics-content no-scrollbar cursor-default">
                <!-- Loading state -->
                <div v-if="isLyricsLoading" class="lyrics-loader">
                    <div class="spinner"></div>
                    <p>Loading lyrics...</p>
                </div>

                <!-- Error state -->
                <div v-else-if="lyricsError" class="lyrics-error">
                    <p>{{ lyricsError }}</p>
                </div>

                <!-- Success state -->
                <div v-else class="lyrics-text no-scrollbar mt-4">
                    <pre v-if="lyricsContent" class="lyrics-pre">{{ lyricsContent }}</pre>
                    <p v-else>No lyrics available for this track.</p>
                </div>
            </div>
        </div>

        <!-- Spotify Mobile Player Styles -->
        <div class="spotify-mobile-player" v-if="isMobileView">
            <!-- Mini player (collapsed state) -->
            <div class="mini-player" v-if="!expandedPlayer" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                @touchend="handleTouchEnd" :style="miniPlayerStyle">
                <div class="mini-player-progress">
                    <div class="mini-progress-fill" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
                </div>
                <div class="mini-player-content">
                    <div class="mini-cover" v-if="currentTrack" @click="animateToFullPlayer">
                        <img :src="currentTrack.cover" alt="Cover" />
                    </div>
                    <div class="mini-track-info" @click="expandPlayer">
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
            <div class="full-player" v-if="expandedPlayer || isTransitioning" :style="fullPlayerStyle"
                @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
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

                <div class="full-cover-art" v-if="currentTrack" @click="openImageModal">
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

                <!-- Lyrics button for mobile -->
                <div class="mobile-lyrics-button-container">
                    <button @click="toggleLyrics" class="mobile-lyrics-btn" :class="{ 'active': showLyrics }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                            <path d="M9 13h6v2H9zM9 9h4v2H9zM9 17h6v2H9z" />
                        </svg>
                        Lyrics
                    </button>
                </div>

                <!-- Mobile lyrics panel -->
                <div class="mobile-lyrics-panel" v-if="showLyrics">
                    <div class="mobile-lyrics-header">
                        <h3>Lyrics</h3>
                        <button @click="toggleLyrics" class="close-mobile-lyrics">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile lyrics content -->
                    <div class="mobile-lyrics-content">
                        <!-- Loading state -->
                        <div v-if="isLyricsLoading" class="lyrics-loader">
                            <div class="spinner"></div>
                            <p>Loading lyrics...</p>
                        </div>

                        <!-- Error state -->
                        <div v-else-if="lyricsError" class="lyrics-error">
                            <p>{{ lyricsError }}</p>
                        </div>

                        <!-- Success state -->
                        <pre v-else-if="lyricsContent" class="lyrics-pre">{{ lyricsContent }}</pre>
                        <p v-else>No lyrics available for this track.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal for full-size cover art -->
        <div class="image-modal" v-if="showImageModal || imageModalTransitioning" @click="closeImageModal"
            :class="{ 'modal-entering': imageModalEntering, 'modal-exiting': imageModalExiting }">
            <div class="image-modal-content" @click.stop :style="imageModalStyle">
                <button class="close-modal-btn" @click="closeImageModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
                <img :src="currentTrack?.cover" alt="Cover Art" class="modal-image" ref="modalImage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { app_url, token } from '@/api';
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
            expandedPlayer: false,
            showLyrics: false,
            showFullLyrics: false,
            lyricsExiting: false,
            isLyricsLoading: false,
            lyricsContent: null as string | null,
            lyricsError: null as string | null,
            // Swipe related properties
            isTransitioning: false,
            touchStartY: 0,
            touchDeltaY: 0,
            swipeThreshold: 100, // pixels to trigger expand/collapse
            playerHeight: 0,
            swipeProgress: 0,
            // Image modal state
            showImageModal: false,
            imageModalTransitioning: false,
            imageModalEntering: false,
            imageModalExiting: false,
            imageClickPosition: { x: 0, y: 0 },
            modalImageRect: { top: 0, left: 0, width: 0, height: 0 },
            targetImageRect: { top: 0, left: 0, width: 0, height: 0 },
        };
    },
    computed: {
        // Simplification des styles du player mobile
        miniPlayerStyle() {
            if (this.isTransitioning) {
                return {
                    transform: `translateY(${this.touchDeltaY}px)`,
                    opacity: 1 - (Math.abs(this.touchDeltaY) / this.playerHeight)
                };
            }
            return {};
        },
        fullPlayerStyle() {
            if (this.isTransitioning) {
                if (this.expandedPlayer) {
                    // Handle downward swipe when expanded
                    return {
                        transform: `translateY(${Math.max(0, this.touchDeltaY)}px)`,
                        opacity: 1 - (Math.max(0, this.touchDeltaY) / this.playerHeight * 0.5)
                    };
                } else {
                    // Handle upward swipe when collapsed
                    const progress = Math.max(0, Math.min(1, Math.abs(this.touchDeltaY) / this.playerHeight));
                    return {
                        transform: `translateY(${(1 - progress) * 100}%)`,
                        opacity: progress
                    };
                }
            }
            return {};
        },
        // Animation style for the image modal
        imageModalStyle() {
            if (this.imageModalEntering || this.imageModalExiting) {
                return {
                    transform: this.imageModalEntering ?
                        `translate(0, 0) scale(1)` :
                        `translate(
                            ${this.targetImageRect.left - this.modalImageRect.left}px, 
                            ${this.targetImageRect.top - this.modalImageRect.top}px
                        ) scale(${this.targetImageRect.width / this.modalImageRect.width})`,
                    transformOrigin: 'center',
                    opacity: this.imageModalEntering ? 1 : 0.5,
                    transition: `transform 0.3s ease, opacity 0.3s ease`
                };
            }
            return {};
        }
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

        // Initialize Media Session API if supported
        if ('mediaSession' in navigator) {
            this.setupMediaSession();
        }
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

            // Reset lyrics state when changing tracks
            this.lyricsContent = null;
            this.lyricsError = null;

            // If lyrics are showing, fetch new lyrics for the new track
            if (this.showLyrics) {
                this.fetchLyrics();
            }

            // Update Media Session metadata when a new track plays
            if ('mediaSession' in navigator) {
                this.updateMediaSessionMetadata();
            }
        },
        togglePlay() {
            if (this.isPlaying) {
                this.audio.pause();
                // Update Media Session playback state
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.playbackState = 'paused';
                }
            } else {
                this.audio.play();
                // Update Media Session playback state
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.playbackState = 'playing';
                }
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
            // Add animation class
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        },

        // New method to animate expanding the player
        animateToFullPlayer() {
            // Start the animation
            this.isTransitioning = true;
            this.touchDeltaY = 0;
            this.playerHeight = window.innerHeight;

            // Initial animation preparation - making it much faster
            const startTime = performance.now();
            const animationDuration = 200; // reduced from 250ms to 200ms
            const targetDelta = -this.swipeThreshold * 2.5; // More dramatic effect

            // Animation function with faster start
            const animateSwipe = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Combined easing function that starts very fast and slows down at the end
                let easedProgress;
                if (progress < 0.2) {
                    // For the first 20% of time, almost jump to 50% of movement
                    easedProgress = progress * 2.5;
                } else {
                    // Then ease out to complete the animation
                    easedProgress = 0.5 + this.easeOutQuint(progress - 0.2) * 0.5;
                }

                this.touchDeltaY = targetDelta * easedProgress;

                if (progress < 1) {
                    // Continue animation
                    requestAnimationFrame(animateSwipe);
                } else {
                    // Animation complete, expand the player
                    this.expandPlayer();
                }
            };

            // Start animation
            requestAnimationFrame(animateSwipe);
        },

        // Add a more aggressive easing function for faster perceived animation
        easeOutQuint(x) {
            return 1 - Math.pow(1 - x, 5);
        },

        // Keep the existing easeOutCubic for other animations
        easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
        },

        collapsePlayer() {
            this.expandedPlayer = false;
            document.body.classList.remove('player-expanded');
            // Add animation class
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        },

        // Touch event handlers for swipe
        handleTouchStart(event: TouchEvent) {
            if (event.touches.length === 1) {
                this.isTransitioning = true;
                this.touchStartY = event.touches[0].clientY;
                this.touchDeltaY = 0;
                this.playerHeight = window.innerHeight;
            }
        },

        handleTouchMove(event: TouchEvent) {
            if (!this.isTransitioning || event.touches.length !== 1) return;
            const touchY = event.touches[0].clientY;
            if (this.expandedPlayer) {
                // When expanded, calculate delta for downward swipe
                this.touchDeltaY = Math.max(0, touchY - this.touchStartY);
            } else {
                // When collapsed, calculate delta for upward swipe
                this.touchDeltaY = Math.min(0, touchY - this.touchStartY);
            }
            // Apply a subtle acceleration factor to make the initial movement feel more responsive
            // This makes small movements feel bigger at the beginning of the gesture
            const accelerationFactor = 1.3;
            this.touchDeltaY = this.touchDeltaY * accelerationFactor;

            // Prevent default to avoid page scroll - reduced threshold from 10 to 5 for quicker response
            if (Math.abs(this.touchDeltaY) > 5) {
                event.preventDefault();
            }
        },

        handleTouchEnd() {
            if (!this.isTransitioning) return;

            // Reduce the threshold to make it easier to trigger the action
            const adjustedThreshold = this.swipeThreshold * 0.8;

            if (this.expandedPlayer) {
                // If swiping down in expanded mode
                if (this.touchDeltaY > adjustedThreshold) {
                    this.collapsePlayer();
                } else {
                    // Reset if swipe wasn't far enough
                    this.isTransitioning = false;
                }
            } else {
                // If swiping up in collapsed mode
                if (Math.abs(this.touchDeltaY) > adjustedThreshold) {
                    this.expandPlayer();
                } else {
                    // Reset if swipe wasn't far enough
                    this.isTransitioning = false;
                }
            }

            this.touchDeltaY = 0;
        },
        // Method to fetch lyrics
        async fetchLyrics() {
            if (!this.currentTrack || !this.currentTrack.videoId) {
                this.lyricsError = "No track selected";
                return;
            }

            // Reset previous lyrics and set loading state
            this.isLyricsLoading = true;
            this.lyricsContent = null;
            this.lyricsError = null;

            try {
                const response = await fetch(`${app_url}/lyrics/${this.currentTrack.videoId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 500) {
                    // Handle error case (500 status)
                    const errorData = await response.json();
                    this.lyricsError = errorData.detail || "Failed to load lyrics";
                } else if (!response.ok) {
                    // Handle other error cases
                    this.lyricsError = `Error: ${response.status} ${response.statusText}`;
                } else {
                    // Handle success case
                    this.lyricsContent = await response.text();
                }
            } catch (error) {
                this.lyricsError = "Failed to fetch lyrics";
                console.error('Error fetching lyrics:', error);
            } finally {
                this.isLyricsLoading = false;
            }
        },

        toggleLyrics() {
            if (!this.isMobileView) {
                // On desktop, directly toggle full lyrics view
                this.showLyrics = !this.showLyrics;
                this.showFullLyrics = this.showLyrics; // Show full lyrics immediately when toggling on

                // Fetch lyrics when opening the lyrics panel
                if (this.showLyrics) {
                    this.fetchLyrics();
                }
            } else {
                // On mobile, just toggle lyrics panel without affecting full view
                this.showLyrics = !this.showLyrics;

                // Fetch lyrics when opening the lyrics panel
                if (this.showLyrics) {
                    this.fetchLyrics();
                }
            }

            // If lyrics are turned off, make sure full lyrics are also off
            if (!this.showLyrics) {
                this.showFullLyrics = false;
            }
        },

        // This method is now only needed for closing the full lyrics view on desktop
        toggleFullLyrics() {
            if (this.showFullLyrics) {
                // Start exit animation
                this.lyricsExiting = true;

                // Delay the actual removal
                setTimeout(() => {
                    this.showFullLyrics = false;
                    this.showLyrics = false;
                    this.lyricsExiting = false;
                }, 500); // Match this with the animation duration
            } else {
                this.showFullLyrics = true;
                this.showLyrics = true;

                // Fetch lyrics when opening full lyrics view
                this.fetchLyrics();
            }
        },

        setupMediaSession() {
            // Set action handlers for media keys
            navigator.mediaSession.setActionHandler('play', () => {
                if (!this.isPlaying) {
                    this.togglePlay();
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (this.isPlaying) {
                    this.togglePlay();
                }
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                this.previousTrack();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                this.nextTrack();
            });

            // Optional: Add seek actions if supported
            try {
                navigator.mediaSession.setActionHandler('seekto', (details) => {
                    if (details.seekTime !== undefined) {
                        this.audio.currentTime = details.seekTime;
                        this.currentTime = this.audio.currentTime;
                    }
                });
            } catch (error) {
                console.log('Seekto action is not supported.');
            }

            // Add position state update on timeupdate
            this.audio.addEventListener('timeupdate', () => {
                if ('setPositionState' in navigator.mediaSession) {
                    navigator.mediaSession.setPositionState({
                        duration: this.duration,
                        playbackRate: this.audio.playbackRate,
                        position: this.currentTime
                    });
                }
            });
        },

        updateMediaSessionMetadata() {
            if (!this.currentTrack) return;

            const artwork = [];

            if (this.currentTrack.cover) {
                artwork.push({
                    src: this.currentTrack.cover,
                    sizes: '512x512', // Default size assumption
                    type: 'image/jpeg' // Default type assumption
                });
            }

            console.log(artwork)
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.currentTrack.title || 'Unknown Title',
                artist: this.currentTrack.Artists?.map(a => a.name).join(', ') || 'Unknown Artist',
                album: this.currentTrack.Album?.name || '',
                artwork: artwork
            });

            // Set playback state
            navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
        },

        // Enhanced image modal methods
        openImageModal(event) {
            if (!this.currentTrack?.cover) return;

            // Store the source image element
            const sourceImage = event.target;
            const sourceRect = sourceImage.getBoundingClientRect();

            // Store the click position and image dimensions
            this.imageClickPosition = {
                x: event.clientX,
                y: event.clientY
            };

            this.targetImageRect = {
                top: sourceRect.top,
                left: sourceRect.left,
                width: sourceRect.width,
                height: sourceRect.height
            };

            // Start transition
            this.imageModalTransitioning = true;
            this.imageModalExiting = false;
            this.imageModalEntering = true;
            this.showImageModal = true;
            document.body.style.overflow = 'hidden'; // Prevent scrolling

            // Get modal image dimensions after rendering
            setTimeout(() => {
                if (this.$refs.modalImage) {
                    const modalImage = this.$refs.modalImage;
                    const rect = modalImage.getBoundingClientRect();
                    this.modalImageRect = {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    };
                }

                // End entering animation
                setTimeout(() => {
                    this.imageModalEntering = false;
                    this.imageModalTransitioning = false;
                }, 300);
            }, 50);
        },

        closeImageModal() {
            // Start exit animation
            this.imageModalTransitioning = true;
            this.imageModalEntering = false;
            this.imageModalExiting = true;

            // After animation completes, reset
            setTimeout(() => {
                this.showImageModal = false;
                this.imageModalTransitioning = false;
                this.imageModalExiting = false;
                document.body.style.overflow = ''; // Restore scrolling
            }, 300);
        },
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
    cursor: pointer;
    /* Indicate the image is clickable */
}

.cover-image:hover {
    transform: scale(1.05);
    /* Slight zoom effect on hover */
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
    touch-action: pan-x;
    /* Allow horizontal scrolling but capture vertical */
    /* Prevent browser's default touch actions */
}

/* Mini Player Styles */
.mini-player {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #1A1A1A;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
    z-index: 50;
    transform: translateY(0);
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
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
    transform: translateY(0);
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
    overscroll-behavior: contain;
}

/* Ajouter ces nouvelles classes CSS pour des transitions plus fluides */
.player-expanded .mini-player {
    opacity: 0;
    pointer-events: none;
}

/* Mini Player Styles */
.mini-player {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #1A1A1A;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
    z-index: 50;
    will-change: transform;
    /* Optimize for animations */
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
    cursor: pointer;
    /* Indicates clickable */
    transition: transform 0.2s ease;
}

.mini-cover:hover {
    transform: scale(1.05);
    /* Slight zoom effect on hover */
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
    cursor: pointer;
    /* Indicates clickable */
}

.mini-title {
    font-weight: 500;
    font-size: 14px;
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
    will-change: transform;
    /* Optimize for animations */
}

/* Replace existing slideUp animation with a more subtle one that can be paused */
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
    cursor: pointer;
    /* Indicate the image is clickable */
    transition: transform 0.3s ease;
}

.full-cover-art:hover {
    transform: scale(1.02);
    /* Slight zoom effect on hover */
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

/* Lyrics Button Styles */
.lyrics-btn {
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
    margin-left: 8px;
}

.lyrics-btn:hover,
.lyrics-btn.active {
    color: #6C63FF;
}

/* Lyrics panel for desktop */
.lyrics-panel {
    position: fixed;
    right: 0;
    bottom: 90px;
    width: 300px;
    max-height: 400px;
    background: #282828;
    border-radius: 8px 0 0 0;
    box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.4);
    z-index: 49;
    animation: slideLeft 0.3s ease;
    overflow: hidden;
}

@keyframes slideLeft {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

.lyrics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #3a3a3a;
}

.lyrics-header h3 {
    margin: 0;
    font-size: 16px;
    color: #fff;
}

.close-lyrics {
    background: transparent;
    border: none;
    color: #B3B3B3;
    cursor: pointer;
}

.lyrics-content {
    padding: 16px;
    height: 350px;
    overflow-y: auto;
    color: #B3B3B3;
    line-height: 1.6;
}

.lyrics-content p {
    margin-bottom: 16px;
}

/* Mobile lyrics styles */
.mobile-lyrics-button-container {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}

.mobile-lyrics-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #B3B3B3;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mobile-lyrics-btn svg {
    margin-right: 4px;
}

.mobile-lyrics-btn:hover,
.mobile-lyrics-btn.active {
    background: rgba(108, 99, 255, 0.2);
    color: #fff;
}

.mobile-lyrics-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #1a1a1a 0%, #121212 100%);
    z-index: 101;
    padding: 32px 24px;
    animation: fadeIn 0.3s ease;
    overflow-y: auto;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.mobile-lyrics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.mobile-lyrics-header h3 {
    margin: 0;
    font-size: 18px;
    color: #fff;
    font-weight: 700;
}

.close-mobile-lyrics {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 8px;
}

.mobile-lyrics-content {
    color: #fff;
    line-height: 1.8;
    font-size: 16px;
    padding-bottom: 40px;
}

.mobile-lyrics-content p {
    margin-bottom: 24px;
    text-align: center;
}

/* Modify existing lyrics panel */
.lyrics-controls {
    display: flex;
    align-items: center;
}

.expand-lyrics {
    background: transparent;
    border: none;
    color: #B3B3B3;
    cursor: pointer;
    padding: 4px;
    margin-right: 8px;
    transition: color 0.2s ease;
}

.expand-lyrics:hover {
    color: #6C63FF;
}

/* Desktop Full-Screen Lyrics */
.desktop-full-lyrics {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #121212 100%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 40px;
    color: #fff;
    animation: fadeIn 0.3s ease;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: transform 0.5s ease, opacity 0.5s ease;
}

/* Animation for exit */
.lyrics-exit-animation {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
    pointer-events: none;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.desktop-full-lyrics-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
}

.track-info-container {
    display: flex;
    align-items: center;
    gap: 24px;
}

.track-cover {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.track-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.track-info-details h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
}

.track-info-details p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.close-full-lyrics {
    background: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s ease;
}

.close-full-lyrics:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
}

.desktop-full-lyrics-content {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    flex: 1;
}

.desktop-full-lyrics-content h3 {
    font-size: 22px;
    color: #6C63FF;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.lyrics-text {
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    padding-bottom: 60px;
    width: 100%;
}

.lyrics-text p {
    margin-bottom: 32px;
    transition: color 0.3s ease, transform 0.3s ease;
}

.lyrics-text p:hover {
    color: #fff;
    transform: scale(1.02);
}

/* For medium screens */
@media (max-width: 1024px) {
    .desktop-full-lyrics {
        padding: 30px;
    }

    .track-cover {
        width: 100px;
        height: 100px;
    }

    .track-info-details h2 {
        font-size: 28px;
    }

    .lyrics-text {
        font-size: 20px;
    }
}

/* For smaller desktop screens */
@media (max-width: 768px) {
    .desktop-full-lyrics {
        padding: 20px;
    }

    .track-cover {
        width: 80px;
        height: 80px;
    }

    .track-info-details h2 {
        font-size: 24px;
    }

    .desktop-full-lyrics-content h3 {
        font-size: 18px;
    }

    .lyrics-text {
        font-size: 18px;
        line-height: 1.6;
    }
}

/* Lyrics loading and error styles */
.lyrics-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(108, 99, 255, 0.3);
    border-radius: 50%;
    border-top-color: #6C63FF;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.lyrics-error {
    color: #ff4d4d;
    text-align: center;
    padding: 20px;
    font-size: 18px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.lyrics-pre {
    font-size: 20px;
    line-height: 1.8;
    white-space: pre-wrap;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    padding-bottom: 60px;
    width: 100%;
    font-family: inherit;
}

/* Mobile lyrics specific styles */
.mobile-lyrics-content .lyrics-pre {
    font-size: 16px;
    line-height: 1.6;
}

.mobile-lyrics-content .lyrics-loader {
    height: 50vh;
}

.mobile-lyrics-content .spinner {
    width: 40px;
    height: 40px;
}

/* Image Modal Styles */
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.3s ease;
    will-change: opacity;
}

.modal-entering {
    animation: modalBackgroundFadeIn 0.3s forwards;
}

.modal-exiting {
    animation: modalBackgroundFadeOut 0.3s forwards;
}

@keyframes modalBackgroundFadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes modalBackgroundFadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.image-modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    will-change: transform;
    transform-origin: center;
}

.modal-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: block;
}

.close-modal-btn {
    position: absolute;
    top: -40px;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2001;
}

.close-modal-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
}

/* ...existing code... */
</style>
