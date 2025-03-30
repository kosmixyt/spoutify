<template>
    <div v-if="Object.keys(albumData).length > 0">
        <div class="flex flex-col md:flex-row items-center md:justify-center">
            <div class="flex justify-center">
                <img :src="bestQualityTumb().url" alt="Album" class="w-56 h-56 object-cover rounded-lg" />
            </div>
            <div class="text-white flex flex-col items-center md:items-start md:justify-center">
                <div class="opacity-50 md:ml-3">
                    {{ isPlaylist() ? "Playlist" : "Album" }}
                </div>
                <div class="text-6xl font-extrabold hover:underline text-center md:text-left md:ml-6">
                    {{ albumData.title }}
                </div>
                <div class="flex flex-col gap-1 opacity-50 items-center mt-4 md:ml-3">
                    <div class="flex items-center gap-2">
                        <div v-for="artist in albumData.artists"
                            class="hover:underline cursor-pointer flex items-center">
                            <router-link :to="'/artist/' + artist.id" class="ml-2">{{
                                artist.name
                            }}</router-link>
                        </div>
                        <div>{{ albumData.year }}</div>
                    </div>
                    <div class="flex gap-2">
                        <div>{{ albumData.tracks.length }} titres</div>
                        <div>{{ albumData.duration }}</div>
                    </div>
                </div>
                <div class="flex gap-4 mt-6 md:ml-8">
                    <button @click="play"
                        class="bg-violet-600 text-white px-6 py-2 rounded-full font-bold hover:bg-violet-700">
                        Play
                    </button>
                    <button @click="dl"
                        class="bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800">
                        Download
                    </button>
                </div>
            </div>
        </div>
        <div class="w-[95%] mx-auto mt-8">
            <div class="flex justify-between mb-4 items-center">
                <h2 class="text-xl font-bold text-white">Titres</h2>
                <div class="flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-md">
                    <label for="sortBy" class="text-white px-3 py-2 text-sm">Trier par:</label>
                    <select id="sortBy" v-model="sortBy"
                        class="bg-gray-900 text-white px-4 py-2 pr-8 rounded-r-lg border-l border-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer transition-all">
                        <option value="default">Par défaut</option>
                        <option value="views">Nombre de vues</option>
                        <option value="duration">Durée</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            <LineSong :force-album-data="toAlbumData()" :song-data="track" :fallback-thumb="albumData.thumbnails[0].url"
                v-for="track in sortedTracks" :key="track.videoId" />
        </div>
    </div>
</template>

<script lang="ts">
import {
    DownloadAlbum,
    GetAlbum,
    getBestQualitythumbnail,
    GetPlaylist,
} from "@/api";
import LineSong from "@/components/LineSong.vue";
import router from "@/router";
import { addToQueue, playTrack, type PlayerServiceRequest } from "@/services/playerService";
import type { Album, AlbumData, Thumbnail } from "@/type";
import { toast } from "vue3-toastify";

export default {
    components: {
        LineSong,
    },
    data() {
        return {
            loading: true,
            albumData: {} as AlbumData,
            toastId: null as string | null,
            sortBy: "default",
        };
    },
    computed: {
        sortedTracks() {
            if (!this.albumData.tracks) return [];

            if (this.sortBy === "default") {
                return this.albumData.tracks;
            } else if (this.sortBy === "views") {
                return [...this.albumData.tracks].sort((a, b) => {
                    return this.parseViewCount(b.views) - this.parseViewCount(a.views);
                });
            } else if (this.sortBy === "duration") {
                return [...this.albumData.tracks].sort((a, b) => {
                    return this.parseDuration(b.duration) - this.parseDuration(a.duration);
                });
            }
            return this.albumData.tracks;
        }
    },
    methods: {
        toAlbumData(): Album {
            return {
                id: this.albumData.audioPlaylistId,
                name: this.albumData.title,
            };
        },
        bestQualityTumb(): Thumbnail {
            return getBestQualitythumbnail(this.albumData.thumbnails);
        },
        dl() {
            this.toastId = toast.loading("Téléchargement en cours...", {
                position: "top-right",
                autoClose: false,
            }) as string;
            toast.info("Ne quitez pas la page !", {
                position: "top-right",
                autoClose: false,
            });
            DownloadAlbum(this.albumData, this.albumData.title, (current, total) => {
                const progress = Math.round((current / total) * 100);
                if (this.toastId) {
                    toast.update(this.toastId, {
                        render: `Téléchargement en cours... ${progress}%`,
                        type: "info",
                        autoClose: false,
                    });
                }
            })
                .then(() => {
                    if (this.toastId) {
                        toast.update(this.toastId, {
                            render: "Téléchargement terminé !",
                            type: "success",
                            autoClose: 5000,
                        });
                        toast.done(this.toastId);
                        this.toastId = null;
                    }
                })
                .catch((err) => {
                    if (this.toastId) {
                        toast.update(this.toastId, {
                            render: "Erreur lors du téléchargement !",
                            type: "error",
                            autoClose: 5000,
                        });
                        toast.done(this.toastId);
                        this.toastId = null;
                    }
                });
        },
        play() {

            const track: PlayerServiceRequest = {
                Artists: this.albumData.artists,
                Album: {
                    id: this.albumData.audioPlaylistId,
                    name: this.albumData.title,
                },
                cover: this.bestQualityTumb().url,
                title: this.albumData.tracks[0].title,
                videoId: this.albumData.tracks[0].videoId,
            };
            playTrack(track);
            for (const track of this.albumData.tracks.slice(1)) {
                const queueTrack: PlayerServiceRequest = {
                    Artists: track.artists,
                    Album: {
                        id: this.albumData.audioPlaylistId,
                        name: this.albumData.title,
                    },
                    cover: this.bestQualityTumb().url,
                    title: track.title,
                    videoId: track.videoId,
                }
                addToQueue(queueTrack)
            }
        },
        isPlaylist(): boolean {
            return this.$route.query.isPlaylist ? true : false;
        },
        parseViewCount(viewsStr) {
            if (!viewsStr) return 0;

            // Nettoyer la chaîne pour ne garder que les chiffres et les suffixes K/M/B
            const cleaned = viewsStr.replace(/[^\d,\.KMB]/gi, '');

            // Extraire le nombre et le suffixe
            const match = cleaned.match(/^([\d,\.]+)([KMB])?$/i);
            if (!match) return 0;

            // Convertir la partie numérique en enlevant les virgules et points non-décimaux
            const numPart = parseFloat(match[1].replace(/,/g, ''));
            const suffix = match[2] ? match[2].toUpperCase() : '';

            // Appliquer les multiplicateurs en fonction du suffixe
            switch (suffix) {
                case 'K': return numPart * 1000;
                case 'M': return numPart * 1000000;
                case 'B': return numPart * 1000000000;
                default: return numPart;
            }
        },

        parseDuration(durationStr) {
            if (!durationStr) return 0;

            // Format attendu: "MM:SS" ou "HH:MM:SS"
            const parts = durationStr.split(':').map(Number);

            if (parts.length === 2) {
                // Format MM:SS
                return parts[0] * 60 + parts[1];
            } else if (parts.length === 3) {
                // Format HH:MM:SS
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            }

            return 0;
        },
    },
    watch: {
        "$route.params.id": {
            immediate: true,
            async handler() {
                if (!this.$route.params.id) router.push("/");
                this.loading = true;
                const id = this.$route.params.id as string;
                this.albumData = await (this.isPlaylist()
                    ? GetPlaylist(id)
                    : GetAlbum(id));
                this.loading = false;
            },
        },
    },
};
</script>

<style scoped>
select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em;
    padding-right: 2rem;
}

.sort-container {
    position: relative;
}
</style>
