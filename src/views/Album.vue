<template>
    <div v-if="Object.keys(albumData).length > 0">
        <div class="flex flex-col md:flex-row items-center md:justify-center">
            <div class="flex justify-center">
                <img :src="bestQualityTumb().url" alt="Album" class="w-56 h-56 object-cover rounded-lg" />
            </div>
            <div class="text-white flex flex-col items-center md:items-start md:justify-center">
                <div class="opacity-50 md:ml-3">{{ isPlaylist() ? 'Playlist' : 'Album' }}</div>
                <div class="text-6xl font-extrabold hover:underline text-center md:text-left md:ml-6">{{ albumData.title
                }}</div>
                <div class="flex flex-col gap-1 opacity-50 items-center mt-4 md:ml-3">
                    <div class="flex items-center gap-2">
                        <div v-for="artist in albumData.artists"
                            class="hover:underline cursor-pointer flex items-center">
                            <div>
                                <img alt="Album" class="w-8 h-8 object-cover rounded-full" />
                            </div>
                            <router-link :to="'/artist/' + artist.id" class="ml-2">{{ artist.name }}</router-link>
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
                        class="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600">
                        Play
                    </button>
                    <button class="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">
                        Download
                    </button>
                </div>
            </div>

        </div>
        <div class="w-[95%] mx-auto mt-8">
            <LineSong :force-album-data="toAlbumData()" :song-data="i" :force-thunm="albumData.thumbnails[0].url"
                v-for="i in albumData.tracks" />
        </div>
    </div>
</template>


<script lang="ts">
import { GetAlbum, getBestQualitythumbnail, GetPlaylist } from '@/api';
import LineSong from '@/components/LineSong.vue';
import router from '@/router';
import { playTrack, type PlayerServiceRequest } from '@/services/playerService';
import type { Album, AlbumData, Thumbnail } from '@/type';

export default {
    components: {
        LineSong
    },
    data() {
        return {
            loading: true,
            albumData: {} as AlbumData,
        }
    },
    methods: {
        toAlbumData(): Album {
            return {
                id: this.albumData.audioPlaylistId,
                name: this.albumData.title,
            }
        },
        bestQualityTumb(): Thumbnail {
            return getBestQualitythumbnail(this.albumData.thumbnails);
        },
        play() {
            const track: PlayerServiceRequest = {
                Artists: this.albumData.artists,
                Album: {
                    id: this.albumData.audioPlaylistId,
                    name: this.albumData.title,
                },
                cover: this.bestQualityTumb().url,
                title: this.albumData.title,
                videoId: this.albumData.tracks[0].videoId,
            }
            playTrack(track);

        },
        isPlaylist(): boolean {
            // return this.$route.query.isPlaylist?.length > 0 ? true : false;
            // if (this.$route.query.isPlaylist) {
            //     return this.$route.query.isPlaylist.length > 0 ? true : false;
            // } else {
            //     return false;
            // }
            return this.$route.query.isPlaylist ? true : false;
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler() {
                if (!this.$route.params.id) router.push('/');
                this.loading = true;
                const id = this.$route.params.id as string
                this.albumData = await (this.isPlaylist() ? GetPlaylist(id) : GetAlbum(id));
                this.loading = false;
            }
        }
    }
}
</script>