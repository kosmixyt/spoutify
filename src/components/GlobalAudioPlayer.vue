<template>
    <div class="fixed bottom-0 left-0 w-full bg-black text-white flex items-center z-50 justify-between px-4 py-2">
        <div class="flex items-center gap-4">
            <img :src="currentTrack?.cover" alt="Cover" class="w-12 h-12 object-cover rounded" v-if="currentTrack" />
            <div class="block">
                <div>
                    <router-link to="/album" class="font-bold" v-if="currentTrack">
                        {{ currentTrack.title }}
                    </router-link>
                </div>
                <div>
                    <router-link to="/artist" class="text-sm opacity-75 cursor-pointer" v-if="currentTrack">
                        {{ currentTrack.artist }}
                    </router-link>
                </div>
                <div>
                    <router-link to="/album" class="text-sm opacity-50 underline" v-if="currentTrack">
                        {{ currentTrack.album }}
                    </router-link>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center gap-2 w-1/2">
            <div class="flex items-center gap-4">
                <button @click="previousTrack" class="bg-transparent p-2 rounded-full hover:text-green-500">⏮</button>
                <button @click="togglePlay" class="bg-green-500 p-3 rounded-full hover:bg-green-400">
                    <span v-if="isPlaying">⏸</span>
                    <span v-else>▶️</span>
                </button>
                <button @click="nextTrack" class="bg-transparent p-2 rounded-full hover:text-green-500">⏭</button>
            </div>
            <div class="flex items-center gap-2 w-full">
                <span class="text-xs">{{ formatTime(currentTime) }}</span>
                <input type="range" class="w-full" min="0" :max="duration" step="0.1" v-model="currentTime"
                    @input="seek" />
                <span class="text-xs">{{ formatTime(duration) }}</span>
            </div>
        </div>
        <div class="text-sm opacity-75">
            Volume: <input type="range" min="0" max="1" step="0.1" v-model="volume" @input="changeVolume" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'GlobalAudioPlayer',
    data() {
        return {
            audio: new Audio(),
            isPlaying: false,
            currentTrack: {
                title: "Random Song",
                artist: "Random Artist",
                album: "Random Album",
                cover: "https://picsum.photos/200/200?random=1",
                src: "https://example.com/random-song.mp3"
            },
            currentTime: 0,
            duration: 0,
            volume: 1,
            playlist: [] as { title: string; artist: string; album: string; cover: string; src: string }[],
            currentTrackIndex: 0
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
    },
    methods: {
        playTrack(track: { title: string; artist: string; album: string; cover: string; src: string }) {
            this.currentTrack = track;
            this.audio.src = track.src;
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
            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
                this.playTrack(this.playlist[this.currentTrackIndex]);
            }
        },
        nextTrack() {
            if (this.currentTrackIndex < this.playlist.length - 1) {
                this.currentTrackIndex++;
                this.playTrack(this.playlist[this.currentTrackIndex]);
            }
        },
        setPlaylist(tracks: { title: string; artist: string; album: string; cover: string; src: string }[]) {
            this.playlist = tracks;
            if (tracks.length > 0) {
                this.currentTrackIndex = 0;
                this.playTrack(tracks[0]);
            }
        }
    }
});
</script>

<style scoped>
/* Couleurs et styles inspirés de Spotify */
.bg-black {
    background-color: #121212;
}

.text-white {
    color: #ffffff;
}

.text-green-500 {
    color: #1db954;
}

.hover\:text-green-500:hover {
    color: #1db954;
}

.bg-green-500 {
    background-color: #1db954;
}

.hover\:bg-green-400:hover {
    background-color: #1ed760;
}

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: #535353;
    height: 4px;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
}
</style>
