<template>
    <div draggable="true"
        class="song-item hover:bg-opacity-10 hover:bg-white p-2 rounded-lg transition-all duration-300"
        @dragstart="onDragStart" @dragend="onDragEnd" @dblclick="playSong" @contextmenu.prevent="showContextMenu">
        <div class="flex flex-col sm:flex-row justify-between mb-1 text-white items-start sm:items-center">
            <div class="flex w-full sm:w-auto">
                <div class="w-12 h-12 sm:w-16 sm:h-16 relative group">
                    <img :src="forceThunm ? forceThunm : songData.thumbnails[0].url" alt="Song"
                        class="w-full h-full rounded-lg shadow-md transition-all" />
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300">
                        <div class="spotify-play-button">
                            <v-icon name="bi-play-fill" color="white"
                                class="rounded-full bg-green-500 p-2 cursor-pointer hover:scale-110 transition-transform"
                                scale="1.5" @click="playSong" />
                        </div>
                    </div>
                </div>

                <div class="ml-3 flex-grow">
                    <div
                        class="font-semibold cursor-pointer text-base sm:text-lg mt-1 sm:mt-2 hover:text-green-400 transition-colors">
                        {{ songData.title }}
                    </div>
                    <div class="flex flex-wrap text-gray-300 gap-1 sm:gap-2 text-sm sm:text-base">
                        <router-link v-for="i in songData.artists" :to="'/artist/' + i.id"
                            class="font-bold hover:text-green-400 transition-colors cursor-pointer">{{ i.name
                            }}</router-link>
                        <div class="font-extrabold">·</div>
                        <router-link :to="'/album/' + albumData().id"
                            class="font-semibold hover:text-green-400 transition-colors cursor-pointer">{{
                                albumData().name }}</router-link>
                    </div>
                </div>
            </div>
            <div class="flex justify-between w-full sm:w-auto mt-2 sm:mt-0 text-sm sm:text-base text-gray-300">
                <div class="sm:mr-10 flex items-center">
                    <v-icon name="bi-eye" scale="0.8" class="mr-1" />
                    {{ formatViews(songData.views) }}
                </div>
                <div class="sm:mr-4 flex items-center">
                    <v-icon name="bi-clock" scale="0.8" class="mr-1" />
                    {{ (songData as Track).duration }}
                </div>
            </div>
        </div>
        <hr class="h-[1px] bg-gray-800 border-none mt-2" />
    </div>

    <!-- Teleport the context menu to the body to avoid positioning issues -->
    <Teleport to="body">
        <div v-if="isContextMenuVisible" class="context-menu" :style="contextMenuStyle" @click.stop>
            <div class="menu-item" @click="playSong">
                <v-icon name="bi-play-fill" class="mr-2" />
                Play
            </div>
            <div class="menu-item" @click="addToQueue">
                <v-icon name="bi-list-ul" class="mr-2" />
                Add to queue
            </div>
            <div class="menu-item" @click="addToPlaylist">
                <v-icon name="bi-plus-circle" class="mr-2" />
                Add to playlist
            </div>
            <div class="menu-item" @click="goToArtist">
                <v-icon name="bi-person" class="mr-2" />
                Go to artist
            </div>
            <div class="menu-item" @click="goToAlbum">
                <v-icon name="bi-disc" class="mr-2" />
                Go to album
            </div>
            <div class="menu-item" @click="shareSong">
                <v-icon name="bi-share" class="mr-2" />
                Share
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts">
import router from '@/router';
import type { Album, SongResult, Track } from '@/type';
import { playTrack, type PlayerServiceRequest } from '@/services/playerService';
import { app_url } from '@/api';

// Create a global event bus for context menu management
const CONTEXT_MENU_EVENT = 'context-menu-opened';

export default {
    props: {
        songData: {
            type: Object as () => SongResult | Track,
            required: true,
        },
        forceThunm: {
            type: String,
            required: false,
        },
        forceAlbumData: {
            type: Object as () => Album,
            required: false,
        }
    },
    data() {
        return {
            isContextMenuVisible: false,
            contextMenuStyle: {
                top: '0px',
                left: '0px'
            }
        };
    },
    mounted() {
        document.addEventListener('click', this.handleGlobalClick);
        document.addEventListener('scroll', this.handleScroll, true);

        // Listen for other context menus being opened
        document.addEventListener(CONTEXT_MENU_EVENT, this.closeMenuOnOtherOpened);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleGlobalClick);
        document.removeEventListener('scroll', this.handleScroll, true);
        document.removeEventListener(CONTEXT_MENU_EVENT, this.closeMenuOnOtherOpened);
    },
    methods: {
        albumData(): Album {
            return this.forceAlbumData ? this.forceAlbumData : this.songData.album as any
        },
        playSong() {
            console.log(this.songData)
            let trackData: PlayerServiceRequest = {
                Artists: this.songData.artists,
                cover: this.thumb(),
                videoId: this.songData.videoId,
                title: this.songData.title,
            }
            if (typeof this.songData.album !== 'string') {
                trackData.Album = this.songData.album as Album;
            }
            playTrack(trackData);
            this.hideContextMenu();
        },
        thumb(): string {
            if (this.forceThunm) {
                return this.forceThunm;
            }
            if (Array.isArray(this.songData.thumbnails) && this.songData.thumbnails.length > 0) {
                return this.songData.thumbnails[0].url;
            } else if (this.songData.thumbnails && typeof this.songData.thumbnails === 'string') {
                return this.songData.thumbnails;
            } else {
                return 'https://via.placeholder.com/150'; // Default image if none available
            }
        },
        formatViews(views: number): string {
            if (views >= 1000000) {
                return (views / 1000000).toFixed(1) + 'M vues';
            } else if (views >= 1000) {
                return (views / 1000).toFixed(1) + 'K vues';
            }
            return views + ' vues';
        },
        onDragStart(event: DragEvent) {
            if (event.target instanceof HTMLElement) {
                event.target.classList.add('dragging');
            }
            // Stocker les données de la chanson pour le drag and drop
            event.dataTransfer?.setData('text/plain', JSON.stringify(this.songData));
        },
        onDragEnd(event: DragEvent) {
            if (event.target instanceof HTMLElement) {
                event.target.classList.remove('dragging');
            }
        },
        // Context Menu Methods
        showContextMenu(event: MouseEvent) {
            // Calculate position for the context menu
            let posX = event.clientX;
            let posY = event.clientY;

            // Get viewport dimensions
            const menuWidth = 180;
            const menuHeight = 250;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Adjust positions to keep menu within viewport
            if (posX + menuWidth > windowWidth) {
                posX = windowWidth - menuWidth - 10;
            }

            if (posY + menuHeight > windowHeight) {
                posY = windowHeight - menuHeight - 10;
            }

            // Update menu position
            this.contextMenuStyle = {
                top: `${posY}px`,
                left: `${posX}px`
            };

            // First, dispatch a custom event to notify other instances to close their menus
            document.dispatchEvent(new CustomEvent(CONTEXT_MENU_EVENT, { detail: this }));

            // Then show this menu
            this.isContextMenuVisible = true;
            event.stopPropagation();
        },

        closeMenuOnOtherOpened(event: CustomEvent) {
            // If this event is from another component, close this menu
            if (event.detail !== this && this.isContextMenuVisible) {
                this.hideContextMenu();
            }
        },

        handleGlobalClick(event: MouseEvent) {
            // Close the menu when clicking outside
            if (this.isContextMenuVisible) {
                this.hideContextMenu();
            }
        },
        handleScroll(event: Event) {
            // Close the menu on any scroll event
            if (this.isContextMenuVisible) {
                this.hideContextMenu();
            }
        },
        hideContextMenu() {
            this.isContextMenuVisible = false;
        },
        addToQueue() {
            // Implement add to queue functionality
            console.log('Add to queue:', this.songData.title);
            this.hideContextMenu();
        },
        addToPlaylist() {
            // Implement add to playlist functionality
            console.log('Add to playlist:', this.songData.title);
            this.hideContextMenu();
        },
        goToArtist() {
            if (this.songData.artists && this.songData.artists.length > 0) {
                router.push(`/artist/${this.songData.artists[0].id}`);
            }
            this.hideContextMenu();
        },
        goToAlbum() {
            const albumData = this.albumData();
            if (albumData && albumData.id) {
                router.push(`/album/${albumData.id}`);
            }
            this.hideContextMenu();
        },
        shareSong() {
            // Implement share functionality
            const songUrl = `${app_url}/song/${this.songData.videoId}`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(songUrl)
                    .then(() => {
                        alert('Link copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                    });
            } else {
                // Fallback method
                const textArea = document.createElement('textarea');
                textArea.value = songUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Link copied to clipboard!');
            }

            this.hideContextMenu();
        }
    }
}
</script>

<style scoped>
.song-item {
    cursor: pointer;
    transform-origin: center;
}

.song-item:hover {
    transform: translateY(-2px);
}

.dragging {
    opacity: 0.5;
    transform: scale(0.98);
}

.spotify-play-button {
    filter: drop-shadow(0 0 4px rgba(30, 215, 96, 0.3));
    transition: all 0.2s ease;
}

.spotify-play-button:hover {
    filter: drop-shadow(0 0 8px rgba(30, 215, 96, 0.5));
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(30, 215, 96, 0.4);
    }

    70% {
        transform: scale(1.02);
        box-shadow: 0 0 0 6px rgba(30, 215, 96, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(30, 215, 96, 0);
    }
}

.context-menu {
    position: fixed;
    /* Important for correct positioning when teleported */
    background: #282828;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    min-width: 180px;
    z-index: 1000;
    overflow: hidden;
}

.menu-item {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    color: #eaeaea;
    font-size: 14px;
    transition: background 0.2s ease;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #1ed760;
}
</style>