<template>
    <div v-if="Object.keys(albumData).length > 0">
        <div class="flex justify-center">
            <div>
                <img :src="bestQualityTumb().url" alt="Album" class="w-56 h-56 object-cover rounded-lg" />
            </div>
            <div class="text-white flex flex-col items-center justify-center">
                <div class="ml-3 opacity-50">Album</div>
                <div class="ml-6 text-6xl font-extrabold hover:underline">{{ albumData.title }}</div>
                <div class="flex flex-col gap-1 opacity-50 ml-3 items-center mt-4">
                    <div class="flex items-center gap-2">
                        <div v-for="artist in albumData.artists"
                            class="hover:underline cursor-pointer flex items-center">
                            <div>
                                <img src="https://picsum.photos/200/200?random=3" alt="Album"
                                    class="w-8 h-8 object-cover rounded-full" />
                            </div>
                            <router-link :to="'/artist/' + artist.id" class="ml-2">{{ artist.name }}</router-link>
                        </div>
                        <div>2015</div>
                    </div>
                    <div class="flex gap-2">
                        <div>18 titres</div>
                        <div>1h 19 min</div>
                    </div>
                </div>
                <div class="flex gap-4 mt-6 ml-8">
                    <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600">
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
import { GetAlbum, getBestQualitythumbnail } from '@/api';
import LineSong from '@/components/LineSong.vue';
import router from '@/router';
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
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler() {
                if (!this.$route.params.id) router.push('/');
                this.loading = true;
                console.log(this.$route.params.id);
                this.albumData = await GetAlbum(this.$route.params.id as string);
                console.log(this.albumData);
                this.loading = false;
            }
        }
    }
}
</script>