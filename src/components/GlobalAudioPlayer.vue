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
                    <button @click="toggleShuffle" class="control-btn" :class="{ 'active-control': isShuffleOn }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                        </svg>
                    </button>
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
                    <button @click="toggleRepeat" class="control-btn"
                        :class="{ 'active-control': repeatMode !== 'off' }">
                        <svg v-if="repeatMode === 'one'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
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
                <!-- Download button for desktop -->
                <button @click="downloadTrack" class="download-btn" v-if="currentTrack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                </button>
                <!-- Queue button for desktop -->
                <button @click="toggleQueue" class="queue-btn" :class="{ 'active': showQueue }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M3 18h6v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3zm0 12h12v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
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

        <!-- Queue panel for desktop -->
        <div class="queue-panel" v-if="!isMobileView && showQueue">
            <div class="queue-header">
                <h3 class="text-violet-700 font-semibold">Queue</h3>
                <div class="queue-controls">
                    <button @click="toggleQueue" class="close-queue hover:text-violet-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="queue-content">
                <ul class="queue-list">
                    <li v-for="(track, index) in queue" :key="index"
                        :class="{ 'active bg-violet-900/20': index === currentTrackIndex }"
                        class="queue-item hover:bg-violet-800/20" @click="playTrackFromQueue(index)">
                        <div class="queue-item-cover">
                            <img :src="track.cover" alt="Cover" />
                        </div>
                        <div class="queue-item-details">
                            <div class="queue-item-title text-violet-100">{{ track.title }}</div>
                            <div class="queue-item-artist text-violet-300">{{track.Artists.map(a => a.name).join(', ')}}
                            </div>
                        </div>
                        <div class="queue-item-duration text-violet-400">{{ formatTime(track.duration) }}</div>
                    </li>
                </ul>
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
                        <button @click="toggleMobileMenu" @touchstart.stop.prevent="toggleMobileMenu"
                            class="menu-dots-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                        <!-- Mobile menu dropdown -->
                        <div v-if="showMobileMenu" class="mobile-menu-dropdown">
                            <div class="mobile-menu-item" @click="toggleLyrics" @touchstart.stop.prevent="toggleLyrics">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                                    <path d="M9 13h6v2H9zM9 9h4v2H9zM9 17h6v2H9z" />
                                </svg>
                                <span>Lyrics</span>
                            </div>
                            <div class="mobile-menu-item" @click="downloadTrack"
                                @touchstart.stop.prevent="downloadTrack" v-if="currentTrack">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                                <span>Télécharger</span>
                            </div>
                            <div class="mobile-menu-item" @click="toggleQueue" @touchstart.stop.prevent="toggleQueue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M3 18h6v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3zm0 12h12v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                </svg>
                                <span>Queue</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="full-cover-art" v-if="currentTrack">
                    <img :src="currentTrack.cover" alt="Cover" />
                </div>

                <div class="full-track-details">
                    <div class="full-title" v-if="currentTrack">{{ currentTrack.title }}</div>
                    <div class="full-artist" v-if="currentTrack && currentTrack.Artists && currentTrack.Artists.length">
                        <router-link v-for="(artist, index) in currentTrack.Artists" :key="index"
                            :to="artist.id ? `/artist/${artist.id}` : ''" class="artist-link"
                            :class="{ 'non-clickable': !artist.id }">
                            {{ artist.name }}<span v-if="index < currentTrack.Artists.length - 1">, </span>
                        </router-link>
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
                    <button @click="toggleShuffle" class="shuffle-btn" :class="{ 'active-btn': isShuffleOn }">
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
                    <button @click="toggleRepeat" class="repeat-btn" :class="{ 'active-btn': repeatMode !== 'off' }">
                        <svg v-if="repeatMode === 'one'" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                        </svg>
                    </button>
                </div>

                <!-- Remove or comment out these containers -->
                <!-- 
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

                <div class="mobile-queue-button-container">
                    <button @click="toggleQueue" class="mobile-queue-btn" :class="{ 'active': showQueue }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M3 18h6v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3zm0 12h12v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        </svg>
                        Queue
                    </button>
                </div>
                -->

                <!-- Mobile lyrics panel -->
                <div class="mobile-lyrics-panel" v-if="showLyrics">
                    <div class="mobile-lyrics-header">
                        <h3>Lyrics</h3>
                        <button @click="toggleLyrics" @touchstart.stop.prevent="toggleLyrics"
                            class="close-mobile-lyrics">
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

                <!-- Mobile queue panel -->
                <div class="mobile-queue-panel" v-if="showQueue">
                    <div class="mobile-queue-header">
                        <h3>Queue</h3>
                        <button @click="toggleQueue" @touchstart.stop.prevent="toggleQueue" class="close-mobile-queue">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile queue content -->
                    <div class="mobile-queue-content">
                        <ul class="mobile-queue-list">
                            <li v-for="(track, index) in queue" :key="index"
                                :class="{ 'active': index === currentTrackIndex }" class="mobile-queue-item"
                                @click="playTrackFromQueue(index)">
                                <div class="mobile-queue-item-cover">
                                    <img :src="track.cover" alt="Cover" />
                                </div>
                                <div class="mobile-queue-item-details">
                                    <div class="mobile-queue-item-title">{{ track.title }}</div>
                                    <div class="mobile-queue-item-artist">{{track.Artists.map(a => a.name).join(', ')
                                    }}
                                    </div>
                                </div>
                                <div class="mobile-queue-item-duration">{{ formatTime(track.duration) }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal for full-size cover art -->
        <div class="image-modal" v-if="showImageModal || imageModalTransitioning" @click.self="closeImageModal"
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
import { app_url, token, Download } from '@/api';
import type { PlayerServiceRequest } from '@/services/playerService';
import { defineComponent } from 'vue';
import { MediaSession } from '@jofr/capacitor-media-session';
import { Capacitor } from '@capacitor/core';

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
            // Queue state
            showQueue: false,
            queue: [] as PlayerServiceRequest[],
            queueHistory: [] as PlayerServiceRequest[], // Tracks we've already played
            // Add this new property for mobile menu
            showMobileMenu: false,
            modalOpenTime: 0, // Timestamp when modal was opened
            // Add new properties for shuffle and repeat
            isShuffleOn: false,
            repeatMode: 'off', // Can be 'off', 'all', or 'one'
            originalQueue: [] as PlayerServiceRequest[], // To store original queue order for shuffle
            // Capacitor MediaSession
            playbackStopped: true,
            isCapacitor: Capacitor.isNativePlatform(),
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

        // Register to receive add-to-queue events
        window.addEventListener('add-to-queue', this.handleAddToQueue as EventListener);

        // Check for mobile view
        this.checkMobileView();
        window.addEventListener('resize', this.checkMobileView);

        // Initialize media session
        if (this.isCapacitor) {
            this.setupCapacitorMediaSession();
        } else if ('mediaSession' in navigator) {
            this.setupMediaSession();
        }

        // Load saved queue from local storage
        this.loadQueueFromStorage();

        this.audio.addEventListener('play', () => {
            this.isPlaying = true; // Synchronize isPlaying state
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false; // Synchronize isPlaying state
        });
    },

    beforeUnmount() {
        // Clean up event listener
        window.removeEventListener('play-track', this.handlePlayRequest as EventListener);
        window.removeEventListener('add-to-queue', this.handleAddToQueue as EventListener);
        window.removeEventListener('resize', this.checkMobileView);

        // Save queue to local storage
        this.saveQueueToStorage();
    },
    methods: {
        playTrack(track: PlayerServiceRequest) {
            this.currentTime = 0;
            this.duration = 0;

            if (track.isOfflineTrack && track.audioBuffer) {
                // Handle offline tracks with buffer data
                const blob = this.base64ToBlob(track.audioBuffer, 'audio/mp3');
                const audioUrl = URL.createObjectURL(blob);
                this.audio.src = audioUrl;

                // Clean up the URL when we're done with it
                this.audio.onload = () => {
                    URL.revokeObjectURL(audioUrl);
                };
            } else {
                // Handle online tracks as before
                this.audio.src = `${app_url}/stream/${track.videoId}`;
            }

            this.audio.load();
            this.currentTrack = track;
            this.audio.play();
            this.isPlaying = true;

            // Reset lyrics state when changing tracks
            this.lyricsContent = null;
            this.lyricsError = null;

            // If lyrics are showing, fetch new lyrics for the new track
            if (this.showLyrics && track.videoId) {
                this.fetchLyrics();
            }

            // Update Media Session metadata when a new track plays
            if (this.isCapacitor) {
                this.updateCapacitorMetadata();
            } else if ('mediaSession' in navigator) {
                this.updateMediaSessionMetadata();
            }

            // Save queue to local storage
            this.saveQueueToStorage();
        },

        // Add helper method to convert base64 to Blob
        base64ToBlob(base64: string, type: string): Blob {
            const byteCharacters = atob(base64);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);

                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            return new Blob(byteArrays, { type });
        },

        // ...existing code...

        handlePlayRequest(event: CustomEvent) {
            const track = event.detail;

            // If there's already a track playing, add it to history
            if (this.currentTrack) {
                this.queueHistory.push(this.currentTrack);
            }

            // Clear the queue if requested
            if (event.detail.clearQueue) {
                this.queue = [];
            }

            // If the playlist property is provided, replace the queue
            if (event.detail.playlist && Array.isArray(event.detail.playlist)) {
                // First track will be played, rest go to queue
                const [firstTrack, ...remainingTracks] = event.detail.playlist;
                this.queue = remainingTracks;
                this.playTrack(firstTrack);
            } else {
                // Play the requested track immediately
                this.currentTrack = track;
                this.playTrack(track);
            }
        },

        // ...existing code...

        // Add a track to queue without playing it
        addToQueue(track: PlayerServiceRequest) {
            this.queue.push(track);
            this.saveQueueToStorage();

            // If this is the only track and nothing is playing, play it
            if (this.queue.length === 1 && !this.currentTrack) {
                this.playTrackFromQueue(0);
            }
        },

        clearQueue() {
            this.queue = [];
            this.queueHistory = [];
            this.saveQueueToStorage();
        },

        togglePlay() {
            if (this.isPlaying) {
                this.audio.pause();
                // Update Media Session playback state
                if (this.isCapacitor) {
                    this.playbackStopped = false;
                    this.updateCapacitorPlaybackState();
                } else if ('mediaSession' in navigator) {
                    navigator.mediaSession.playbackState = 'paused';
                }
            } else {
                this.audio.play();
                // Update Media Session playback state
                if (this.isCapacitor) {
                    this.playbackStopped = false;
                    this.updateCapacitorPlaybackState();
                } else if ('mediaSession' in navigator) {
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
            // If we're more than 3 seconds into a song, restart it instead of going back
            if (this.currentTime > 3) {
                this.audio.currentTime = 0;
                return;
            }

            // Check if we have previous tracks in history
            if (this.queueHistory.length > 0) {
                // Get the last track from history
                const previousTrack = this.queueHistory.pop();
                if (previousTrack) {
                    // Add current track back to the front of the queue if it exists
                    if (this.currentTrack) {
                        this.queue.unshift(this.currentTrack);
                    }

                    // Play the previous track
                    this.currentTrack = previousTrack;
                    this.playTrack(previousTrack);
                }
            }
        },

        nextTrack() {
            if (this.repeatMode === 'one' && this.currentTrack) {
                // If repeat one is enabled, just restart the current track
                this.audio.currentTime = 0;
                this.audio.play();
                return;
            }

            // If there are tracks in the queue
            if (this.queue.length > 0) {
                // Add current track to history if it exists
                if (this.currentTrack) {
                    this.queueHistory.push(this.currentTrack);
                }

                // Get the next track from the queue
                const nextTrack = this.queue.shift();
                if (nextTrack) {
                    this.currentTrack = nextTrack;
                    this.playTrack(nextTrack);
                }
            } else if (this.repeatMode === 'all' && this.currentTrack) {
                // If queue is empty but repeat all is on, restore queue from history + current track
                if (this.queueHistory.length > 0) {
                    this.queue = [...this.queueHistory];
                    this.queueHistory = [];
                }

                // Put current track at end of queue
                this.queue.push(this.currentTrack);

                // Then get the next track
                const nextTrack = this.queue.shift();
                if (nextTrack) {
                    this.currentTrack = nextTrack;
                    this.playTrack(nextTrack);
                }

                // Reshuffle if shuffle is on
                if (this.isShuffleOn) {
                    this.originalQueue = [...this.queue];
                    for (let i = this.queue.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
                    }
                }
            } else {
                // No more tracks to play and repeat all is off
                this.audio.pause();
                this.isPlaying = false;
            }
        },

        playTrackFromQueue(index: number) {
            if (index >= 0 && index < this.queue.length) {
                // Add current track to history if it exists
                if (this.currentTrack) {
                    this.queueHistory.push(this.currentTrack);
                }

                // Get the selected track
                const selectedTrack = this.queue[index];

                // Remove it from the queue
                this.queue.splice(index, 1);

                // Play it
                this.currentTrack = selectedTrack;
                this.playTrack(selectedTrack);
            }
        },

        // Store queue in local storage
        saveQueueToStorage() {
            try {
                const queueData = {
                    currentTrack: this.currentTrack,
                    queue: this.queue,
                    queueHistory: this.queueHistory,
                    isShuffleOn: this.isShuffleOn,
                    repeatMode: this.repeatMode,
                    originalQueue: this.originalQueue
                };
                localStorage.setItem('spoutify-queue', JSON.stringify(queueData));
            } catch (error) {
                console.error('Failed to save queue to local storage:', error);
            }
        },

        // Load queue from local storage
        loadQueueFromStorage() {
            try {
                const savedQueue = localStorage.getItem('spoutify-queue');
                if (savedQueue) {
                    const queueData = JSON.parse(savedQueue);
                    this.currentTrack = queueData.currentTrack;
                    this.queue = queueData.queue || [];
                    this.queueHistory = queueData.queueHistory || [];
                    this.isShuffleOn = queueData.isShuffleOn || false;
                    this.repeatMode = queueData.repeatMode || 'off';
                    this.originalQueue = queueData.originalQueue || [];

                    // If there was a current track, prepare it but don't autoplay
                    if (this.currentTrack && this.currentTrack.videoId) {
                        this.audio.src = `${app_url}/stream/${this.currentTrack.videoId}`;
                        this.audio.load();
                    }
                }

                // Fall back to separate storage for repeat mode if needed
                if (!savedQueue) {
                    const savedRepeatMode = localStorage.getItem('spoutify-repeat-mode');
                    if (savedRepeatMode) {
                        this.repeatMode = savedRepeatMode;
                    }
                }
            } catch (error) {
                console.error('Failed to load queue from local storage:', error);
            }
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
            document.body.style.overflow = 'hidden'; // Disable scrolling
            document.body.classList.add('player-expanded');
            // Add animation class
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        },

        // New method to animate expanding the player
        animateToFullPlayer(event) {
            // Stop event propagation to prevent other click handlers
            if (event) event.stopPropagation();

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
            document.body.style.overflow = ''; // Re-enable scrolling
            document.body.classList.remove('player-expanded');
            // Close mobile menu if open
            this.showMobileMenu = false;
            // Add animation class
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        },

        // Touch event handlers for swipe
        handleTouchStart(event: TouchEvent) {
            // Ignorer si l'événement provient d'un élément du menu
            if (event.target.closest('.mobile-menu-dropdown') ||
                event.target.closest('.menu-dots-btn') ||
                event.target.closest('.mobile-lyrics-panel') ||
                event.target.closest('.mobile-queue-panel')) {
                return;
            }

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

            // Make sure to close the mobile menu when interacting with the player
            this.showMobileMenu = false;

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

        toggleLyrics(event) {
            console.log('Toggling lyrics panel');
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.showMobileMenu = false; // Close menu
            this.showQueue = false; // Close queue panel if open

            if (!this.isMobileView) {
                // On desktop, directly toggle full lyrics view
                this.showLyrics = !this.showLyrics;
                this.showFullLyrics = this.showLyrics; // Show full lyrics immediately when toggling on

                // Fetch lyrics when opening the lyrics panel
                if (this.showLyrics) {
                    this.fetchLyrics();
                }
            } else {
                console.log('Mobile view detected, toggling lyrics panel');
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
                    this.audio.play(); // Ensure audio plays
                    this.isPlaying = true; // Synchronize state
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (this.isPlaying) {
                    this.audio.pause(); // Ensure audio pauses
                    this.isPlaying = false; // Synchronize state
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

            // Prevent event bubbling
            if (event) {
                event.stopPropagation();
            }

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
            this.modalOpenTime = Date.now(); // Record when modal was opened
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

        closeImageModal(event) {
            // Prevent accidental closing by adding a delay check
            if (Date.now() - this.modalOpenTime < 500) {
                // If less than 500ms since opening, ignore the close event
                return;
            }

            // Only proceed with closing if it's a deliberate action
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

        toggleMobileMenu(event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            // Fermer les autres panneaux ouverts
            this.showLyrics = false;
            this.showQueue = false;
            this.showMobileMenu = !this.showMobileMenu;
        },

        // Queue methods
        toggleQueue(event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.showMobileMenu = false; // Close menu
            this.showLyrics = false; // Close lyrics panel if open
            this.showQueue = !this.showQueue;
        },
        handleAddToQueue(event: CustomEvent) {
            const track = event.detail as PlayerServiceRequest;
            this.addToQueue(track);

            // Show the queue briefly when adding tracks
            if (!this.showQueue) {
                this.showQueue = true;

                // Auto-hide the queue after a delay (optional)
                setTimeout(() => {
                    if (!this.isMobileView) {
                        this.showQueue = false;
                    }
                }, 4000);
            }
        },

        // Add new methods for shuffle and repeat functionality
        toggleShuffle() {
            this.isShuffleOn = !this.isShuffleOn;

            if (this.isShuffleOn) {
                // Save the original queue order
                this.originalQueue = [...this.queue];

                // Shuffle the queue using Fisher-Yates algorithm
                for (let i = this.queue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
                }

                // Show notification (optional)
                this.showNotification('Shuffle mode enabled');
            } else {
                // Restore original queue order if we saved it
                if (this.originalQueue.length > 0) {
                    this.queue = [...this.originalQueue];
                    this.originalQueue = [];
                }

                // Show notification (optional)
                this.showNotification('Shuffle mode disabled');
            }

            // Save queue to local storage
            this.saveQueueToStorage();
        },

        toggleRepeat() {
            // Cycle through repeat modes: off -> all -> one -> off
            if (this.repeatMode === 'off') {
                this.repeatMode = 'all';
                this.showNotification('Repeat all');
            } else if (this.repeatMode === 'all') {
                this.repeatMode = 'one';
                this.showNotification('Repeat one');
            } else {
                this.repeatMode = 'off';
                this.showNotification('Repeat off');
            }

            // Save preference to local storage
            localStorage.setItem('spoutify-repeat-mode', this.repeatMode);
        },

        showNotification(message: string) {
            // Simple notification function (you can enhance this)
            console.log(message);
            // You could implement a UI toast notification here
        },

        // Add download functionality
        downloadTrack() {
            if (!this.currentTrack) return;

            // Close the mobile menu if open
            this.showMobileMenu = false;

            // Show notification
            this.showNotification('Démarrage du téléchargement...');

            // Call the Download function from the API
            Download(
                this.currentTrack.videoId,
                this.currentTrack.title,
                this.currentTrack.cover
            );
        },

        // Setup Capacitor MediaSession
        setupCapacitorMediaSession() {
            // Setup event listeners for updating position and playback state
            this.audio.addEventListener('durationchange', this.updatePositionState);
            this.audio.addEventListener('seeked', this.updatePositionState);
            this.audio.addEventListener('ratechange', this.updatePositionState);
            this.audio.addEventListener('play', this.updatePositionState);
            this.audio.addEventListener('pause', this.updatePositionState);

            this.audio.addEventListener('play', () => {
                this.playbackStopped = false;
                this.updateCapacitorPlaybackState();
                this.updateCapacitorMetadata();
            });

            this.audio.addEventListener('pause', this.updateCapacitorPlaybackState);

            // Setup action handlers
            this.setupCapacitorActionHandlers();
        },

        updatePositionState() {
            if (!this.isCapacitor) return;

            MediaSession.setPositionState({
                position: this.audio.currentTime,
                duration: this.audio.duration,
                playbackRate: this.audio.playbackRate
            });
        },

        updateCapacitorPlaybackState() {
            if (!this.isCapacitor) return;

            const playbackState = this.playbackStopped ? 'none' : (this.audio.paused ? 'paused' : 'playing');
            MediaSession.setPlaybackState({
                playbackState: playbackState
            });
        },

        updateCapacitorMetadata() {
            if (!this.isCapacitor || !this.currentTrack) return;

            const artwork = [];
            if (this.currentTrack.cover) {
                artwork.push({
                    src: this.currentTrack.cover,
                    type: 'image/jpeg',
                    sizes: '512x512'
                });
            }

            MediaSession.setMetadata({
                title: this.currentTrack.title || 'Unknown Title',
                artist: this.currentTrack.Artists?.map(a => a.name).join(', ') || 'Unknown Artist',
                album: this.currentTrack.Album?.name || '',
                artwork: artwork
            });
        },

        setupCapacitorActionHandlers() {
            if (!this.isCapacitor) return;

            MediaSession.setActionHandler({ action: 'play' }, () => {
                this.audio.play();
            });

            MediaSession.setActionHandler({ action: 'pause' }, () => {
                this.audio.pause();
            });

            MediaSession.setActionHandler({ action: 'seekto' }, (details) => {
                if (details.seekTime !== undefined) {
                    this.audio.currentTime = details.seekTime;
                }
            });

            MediaSession.setActionHandler({ action: 'seekforward' }, (details) => {
                const seekOffset = details.seekOffset ?? 30;
                this.audio.currentTime = Math.min(this.audio.currentTime + seekOffset, this.audio.duration);
            });

            MediaSession.setActionHandler({ action: 'seekbackward' }, (details) => {
                const seekOffset = details.seekOffset ?? 30;
                this.audio.currentTime = Math.max(this.audio.currentTime - seekOffset, 0);
            });

            MediaSession.setActionHandler({ action: 'nexttrack' }, () => {
                this.nextTrack();
            });

            MediaSession.setActionHandler({ action: 'previoustrack' }, () => {
                this.previousTrack();
            });

            MediaSession.setActionHandler({ action: 'stop' }, () => {
                this.playbackStopped = true;
                this.audio.pause();
                this.audio.currentTime = 0;
            });
        },
    },
    watch: {

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
    background: linear-gradient(to right, #0c0414, #180a29, #0c0414);
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
    background: #9370db;
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
    box-shadow: 0 2px 8px rgba(147, 112, 219, 0.5);
}

.play-btn:hover {
    background: #a080ea;
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
    background-color: #9370db;
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
    background-color: #9370db;
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
    background: #9370db;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(147, 112, 219, 0.7);
    opacity: 1;
}

.progress-bar-wrapper:hover .progress-bar-fill,
.volume-slider-wrapper:hover .volume-slider-fill {
    background-color: #b19cd9;
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

/* Queue/Playlist Styles */
.queue-panel {
    position: fixed;
    right: 0;
    bottom: 90px;
    width: 350px;
    max-height: 500px;
    background: linear-gradient(to bottom, #180a29, #0c0414);
    border-radius: 8px 0 0 0;
    box-shadow: -2px -2px 15px rgba(0, 0, 0, 0.5);
    z-index: 49;
    animation: slideLeft 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(147, 112, 219, 0.3);
}

.queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(147, 112, 219, 0.2);
    background: rgba(26, 15, 41, 0.8);
}

.queue-header h3 {
    margin: 0;
    font-size: 18px;
    color: #9370db;
    font-weight: 600;
}

.queue-controls {
    display: flex;
    align-items: center;
}

.close-queue {
    background: transparent;
    border: none;
    color: #B3B3B3;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-queue:hover {
    color: #ffffff;
    background: rgba(147, 112, 219, 0.2);
    transform: scale(1.1);
}

.queue-content {
    padding: 12px;
    height: 450px;
    overflow-y: auto;
    color: #B3B3B3;
}

.queue-content::-webkit-scrollbar {
    width: 8px;
}

.queue-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.queue-content::-webkit-scrollbar-thumb {
    background: rgba(147, 112, 219, 0.4);
    border-radius: 4px;
}

.queue-content::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 112, 219, 0.6);
}

.queue-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.queue-item {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    margin-bottom: 6px;
}

.queue-item:hover {
    background-color: rgba(147, 112, 219, 0.15);
    transform: translateX(2px);
}

.queue-item.active {
    background-color: rgba(147, 112, 219, 0.25);
    border-left: 3px solid #9370db;
}

.queue-item-cover {
    width: 42px;
    height: 42px;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 14px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.queue-item-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.queue-item:hover .queue-item-cover img {
    transform: scale(1.05);
}

.queue-item-details {
    flex: 1;
    overflow: hidden;
}

.queue-item-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    transition: color 0.2s ease;
}

.queue-item:hover .queue-item-title {
    color: #b19cd9;
}

.queue-item-artist {
    font-size: 12px;
    color: #B3B3B3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;
}

.queue-item:hover .queue-item-artist {
    color: #d1c4e9;
}

.queue-item-duration {
    font-size: 12px;
    color: #9370db;
    margin-left: 12px;
    flex-shrink: 0;
}

@keyframes slideLeft {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Mobile queue styles */
.mobile-queue-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #0c0414 0%, #180a29 100%);
    z-index: 101;
    padding: 32px 24px;
    animation: fadeIn 0.3s ease;
    overflow-y: auto;
}

.mobile-queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.mobile-queue-header h3 {
    margin: 0;
    font-size: 18px;
    color: #fff;
    font-weight: 700;
}

.close-mobile-queue {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 8px;
}

.mobile-queue-content {
    padding-bottom: 40px;
}

.mobile-queue-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.mobile-queue-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-queue-item.active {
    background-color: rgba(147, 112, 219, 0.15);
    border-radius: 8px;
    padding: 12px 8px;
    margin: 0 -8px;
}

.mobile-queue-item-cover {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 16px;
    flex-shrink: 0;
}

.mobile-queue-item-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mobile-queue-item-details {
    flex: 1;
    overflow: hidden;
}

.mobile-queue-item-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-queue-item-artist {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-queue-item-duration {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-left: 16px;
    flex-shrink: 0;
}

.queue-btn {
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

.queue-btn:hover,
.queue-btn.active {
    color: #6C63FF;
}

.mobile-queue-button-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.mobile-queue-btn {
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

.mobile-queue-btn svg {
    margin-right: 4px;
}

.mobile-queue-btn:hover,
.mobile-queue-btn.active {
    background: rgba(147, 112, 219, 0.2);
    color: #fff;
}

/* Spotify Mobile Player Styles */
.spotify-mobile-player {
    touch-action: pan-x;
    width: 100%;
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
    background: linear-gradient(145deg, #0c0414 0%, #180a29 100%);
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
    box-shadow: 0 20px 40px rgba(147, 112, 219, 0.2);
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
    background: linear-gradient(180deg, rgba(147, 112, 219, 0.1) 0%, rgba(26, 26, 26, 0) 100%);
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
    background: #9370db;
    border: none;
    color: #fff;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(147, 112, 219, 0.4);
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
    box-shadow: 0 12px 36px rgba(147, 112, 219, 0.5);
    background: #a080ea;
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
    display: none;
    /* Hide the original buttons */
}

.mobile-lyrics-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #0c0414 0%, #180a29 100%);
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
    background: linear-gradient(135deg, #1a0d2c 0%, #0c0414 50%, #0a0310 100%);
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
    color: #9370db;
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
    border: 3px solid rgba(147, 112, 219, 0.3);
    border-radius: 50%;
    border-top-color: #9370db;
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

/* Add new mobile menu dropdown styles */
.menu-dots {
    position: relative;
}

.menu-dots-btn {
    background: transparent;
    border: none;
    color: #fff;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    /* Supprimer la surbrillance sur appui mobile */
    touch-action: manipulation;
    /* Améliorer la gestion des interactions tactiles */
    user-select: none;
    /* Empêcher la sélection de texte involontaire */
}

.mobile-menu-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 160px;
    background: #2a2a2a;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 110;
    overflow: hidden;
    margin-top: 8px;
    animation: fadeInDown 0.2s ease forwards;
    touch-action: manipulation;
    /* Améliorer la gestion des interactions tactiles */
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    /* Supprimer la surbrillance sur appui mobile */
    touch-action: manipulation;
    /* Améliorer la gestion des interactions tactiles */
    user-select: none;
    /* Empêcher la sélection de texte involontaire */
}

.mobile-menu-item:hover {
    background-color: rgba(147, 112, 219, 0.2);
}

.mobile-menu-item svg {
    color: #9370db;
}

/* Update existing mobile queue and lyrics button containers */
.mobile-lyrics-button-container,
.mobile-queue-button-container {
    display: none;
    /* Hide the original buttons */
}

.close-mobile-lyrics,
.close-mobile-queue {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    /* Supprimer la surbrillance sur appui mobile */
    touch-action: manipulation;
    /* Améliorer la gestion des interactions tactiles */
    user-select: none;
    /* Empêcher la sélection de texte involontaire */
}

/* Add styles for active control buttons */
.control-btn.active-control {
    color: #9370db;
}

.shuffle-btn.active-btn,
.repeat-btn.active-btn {
    color: #9370db;
}

/* Download button styles */
.download-btn {
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

.download-btn:hover {
    color: #6C63FF;
    background: rgba(147, 112, 219, 0.1);
}

/* Add these new styles for clickable artists in mobile player */
.artist-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
}

.artist-link:not(.non-clickable):hover {
    color: #9370db;
    text-decoration: underline;
}

.non-clickable {
    pointer-events: none;
}
</style>
