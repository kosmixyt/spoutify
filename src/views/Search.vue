<template>
    <div class="text-zinc-100 px-1 sm:px-2 md:px-0">
        <div class="text-xl sm:text-2xl md:text-4xl font-bold md:text-left mt-3 md:mt-0 text-center">Search : {{ query
        }}</div>

        <!-- Loading indicator -->
        <div v-if="loading" class="flex justify-center mt-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>

        <!-- Results sections -->
        <div v-else>
            <!-- Empty search message -->

            <!-- Top Result Section -->
            <div v-if="getTopResult()" class="mt-3 sm:mt-4 md:mt-8">
                <h2 class="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-4">Top Result</h2>
                <div v-if="getTopResult().resultType === 'song'"
                    class="flex items-center p-1.5 sm:p-2 md:p-4 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors">
                    <img :src="bestQualityTumb(getTopResult().thumbnails)"
                        class="w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 object-cover rounded" />
                    <div class="ml-2 sm:ml-3 md:ml-4 overflow-hidden">
                        <div class="text-base sm:text-lg md:text-3xl font-bold truncate">{{ getTopResult().title }}
                        </div>
                        <div class="text-xs sm:text-sm md:text-xl text-zinc-400 truncate">{{ getTopResult().artist }}
                        </div>
                        <div class="mt-0.5 sm:mt-1 md:mt-2 text-xs md:text-base text-zinc-500">Song</div>
                    </div>
                </div>

                <router-link :to="'/artist/' + getTopResult()?.artists[0].id"
                    v-else-if="getTopResult()!.resultType === 'artist'"
                    class="flex items-center p-1.5 sm:p-2 md:p-4 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors">
                    <img :src="bestQualityTumb(getTopResult()!.thumbnails).url"
                        class="w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 object-cover rounded-full" />
                    <div class="ml-2 sm:ml-3 md:ml-4 overflow-hidden">
                        <div class="text-base sm:text-lg md:text-3xl font-bold truncate">{{
                            getTopResult()!.artists[0]!.name }}</div>
                        <div class="mt-0.5 sm:mt-1 md:mt-2 text-xs md:text-base text-zinc-500">Artist</div>
                    </div>
                </router-link>

                <router-link :to="'/album/' + getTopResult()?.playlistId + '?isPlaylist=true'"
                    v-else-if="getTopResult()!.resultType === 'playlist'"
                    class="flex items-center p-1.5 sm:p-2 md:p-4 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors">
                    <img :src="bestQualityTumb(getTopResult()!.thumbnails).url"
                        class="w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 object-cover rounded" />
                    <div class="ml-2 sm:ml-3 md:ml-4 overflow-hidden">
                        <div class="text-base sm:text-lg md:text-3xl font-bold truncate">{{ getTopResult().title }}
                        </div>
                        <div class="text-xs sm:text-sm md:text-xl text-zinc-400 truncate">{{
                            getTopResult().description }}</div>
                        <div class="mt-0.5 sm:mt-1 md:mt-2 text-xs md:text-base text-zinc-500">Playlist</div>
                    </div>
                </router-link>

                <div @click="() => play(getTopResult())" v-else-if="getTopResult()!.resultType === 'video'"
                    class="flex items-center p-1.5 sm:p-2 md:p-4 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors">
                    <img :src="bestQualityTumb(getTopResult().thumbnails).url"
                        class="w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 object-cover rounded" />
                    <div class="ml-2 sm:ml-3 md:ml-4 overflow-hidden">
                        <div class="text-base sm:text-lg md:text-3xl font-bold truncate">{{ getTopResult().title }}
                        </div>
                        <div v-for="artist in getTopResult().artists"
                            class="hover:underline cursor-pointer flex items-center opacity-50">
                            <router-link :to="'/artist/' + artist.id" class="ml-1 md:ml-2">{{ artist.name
                            }}</router-link>
                        </div>
                        <div class="mt-0.5 sm:mt-1 md:mt-2 text-xs md:text-base text-zinc-500">Video</div>
                    </div>
                </div>
            </div>

            <!-- Results grouped by type -->
            <div v-for="type in getUniqueResultTypes()" :key="type" class="mt-3 sm:mt-4 md:mt-8">
                <h2 class="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-4">{{
                    type.charAt(0).toUpperCase() +
                    type.slice(1) +
                    's' }}</h2>
                <div class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-2 md:gap-3">
                    <!-- Songs -->
                    <div @click="() => play(item)" v-if="type === 'song'" v-for="item in getResultsByType(type)"
                        :key="item.videoId"
                        class="p-1 sm:p-2 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors touch-manipulation">
                        <img :src="bestQualityTumb(item.thumbnails).url"
                            class="w-full aspect-square object-cover rounded" />
                        <div class="mt-0.5 sm:mt-1">
                            <div class="font-semibold text-xs sm:text-sm truncate">{{ item.title }}</div>
                            <div class="text-zinc-400 text-xs truncate hidden sm:block">{{ item.artist }}</div>
                        </div>
                    </div>

                    <!-- Artists -->
                    <router-link v-if="type === 'artist'" v-for="item in getResultsByType(type)" :key="item.browseId"
                        :to="'/artist/' + item.browseId"
                        class="p-1 sm:p-2 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors touch-manipulation">
                        <img :src="bestQualityTumb(item.thumbnails).url"
                            class="w-full aspect-square object-cover rounded-full" />
                        <div class="mt-0.5 sm:mt-1">
                            <div class="font-semibold text-xs sm:text-sm truncate">{{ item.artist }}</div>
                            <div class="text-zinc-400 text-xs hidden sm:block">Artist</div>
                        </div>
                    </router-link>

                    <!-- Albums -->
                    <router-link v-if="type === 'album'" v-for="item in getResultsByType(type)" :key="item.browseId"
                        :to="'/album/' + item.browseId"
                        class="p-1 sm:p-2 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors touch-manipulation">
                        <img :src="bestQualityTumb(item.thumbnails).url"
                            class="w-full aspect-square object-cover rounded" />
                        <div class="mt-0.5 sm:mt-1">
                            <div class="font-semibold text-xs sm:text-sm truncate">{{ item.title }}</div>
                            <div class="text-zinc-400 text-xs truncate">{{ item.artist }}</div>
                        </div>
                    </router-link>

                    <!-- Playlists -->
                    <router-link v-if="type === 'playlist'" v-for="item in getResultsByType(type)" :key="item.browseId"
                        :to="'/album/' + item.browseId + '?isPlaylist=true'"
                        class="p-1 sm:p-2 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors touch-manipulation">
                        <img :src="bestQualityTumb(item.thumbnails).url"
                            class="w-full aspect-square object-cover rounded" />
                        <div class="mt-0.5 sm:mt-1">
                            <div class="font-semibold text-xs sm:text-sm truncate">{{ item.title }}</div>
                            <div class="text-zinc-400 text-xs truncate">{{ item.description }}</div>
                        </div>
                    </router-link>

                    <!-- Videos -->
                    <div @click="() => play(item)" v-if="type === 'video'" v-for="item in getResultsByType(type)"
                        :key="item.videoId"
                        class="p-1 sm:p-2 bg-zinc-900/50 backdrop-blur rounded-lg hover:bg-zinc-800/50 active:bg-zinc-700/50 cursor-pointer transition-colors touch-manipulation">
                        <img :src="bestQualityTumb(item.thumbnails).url"
                            class="w-full aspect-square object-cover rounded" />
                        <div class="mt-0.5 sm:mt-1">
                            <div class="font-semibold text-xs sm:text-sm truncate">{{ item.title }}</div>
                            <div v-for="artist in item.artists" :key="artist.id"
                                class="text-zinc-400 text-xs hover:underline">
                                <router-link :to="'/artist/' + artist.id">{{ artist.name }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No results message -->
            <div v-if="results.length === 0 && query !== ''" class="mt-8 text-center text-zinc-400">
                No results found for "{{ query }}"
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getBestQualitythumbnail, Search } from '@/api';
import LineSong from '@/components/LineSong.vue';
import { playTrack, type PlayerServiceRequest } from '@/services/playerService';
import type { SearchItem, Thumbnail } from '@/type';


export default {
    data() {
        return {
            loading: true,
            results: [] as SearchItem[],
            searchTimer: null as number | null,
            query: this.$route.query.q as string,
        }
    },

    watch: {
        '$route.query.q': {
            immediate: true,
            handler() {
                this.query = this.$route.query.q as string;
                this.debouncedSearch(this.query);
            }
        }
    },

    methods: {
        debouncedSearch(query: string) {
            // Clear any existing timer
            if (this.searchTimer !== null) {
                clearTimeout(this.searchTimer);
            }

            // Set loading state
            this.loading = true;

            // Set a new timer
            this.searchTimer = setTimeout(async () => {
                console.log("Searching for:", query);
                if (query === "") {
                    this.results = [];
                    this.loading = false;
                    return;
                }
                this.results = await Search(query, "");
                console.log(this.results);
                this.loading = false;
                this.searchTimer = null;
            }, 500); // 500ms debounce time
        },
        bestQualityTumb(thumbnails: Thumbnail[]) {
            // return thumbnails[0].url; // Assuming the first thumbnail is the best quality
            return getBestQualitythumbnail(thumbnails);
        },
        getSongResults() {
            return this.results.filter(item => item.resultType === 'song');
        },
        getArtistResults() {
            return this.results.filter(item => item.resultType === 'artist');
        },
        getTopResult() {
            const topResults = this.results.filter(item => item.category === "Top result");
            return topResults.length > 0 ? topResults[0] : null;
        },
        play(item: SearchItem) {

            const track: PlayerServiceRequest = {
                Artists: item.artists ?? [],
                cover: this.bestQualityTumb(item.thumbnails).url,
                title: item.title ?? "",
                videoId: item.videoId ?? "",
            };
            playTrack(track);

        },
        getUniqueResultTypes() {
            // Get all result types excluding those from top result items
            const types = new Set<string>();
            this.results.forEach(item => {
                if (item.category !== "Top result" && item.resultType) {
                    types.add(item.resultType);
                }
            });
            return Array.from(types);
        },
        getResultsByType(type: string) {
            // Get all results of a specific type, excluding top result items
            return this.results.filter(item =>
                item.resultType === type && item.category !== "Top result"
            );
        }
    }
}
</script>

<style scoped>
/* Add tap highlight color for mobile */
@media (max-width: 640px) {

    a,
    .cursor-pointer {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
    }

    /* Hide scrollbar on mobile but allow scrolling */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Enable smoother scrolling on iOS */
    body {
        -webkit-overflow-scrolling: touch;
    }
}

/* Prevent text selection on mobile taps */
.touch-manipulation {
    touch-action: manipulation;
}
</style>