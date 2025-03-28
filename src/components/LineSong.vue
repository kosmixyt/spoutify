<template>
    <div draggable="true">
        <div class="flex justify-between mt-1 mb-1 text-white items-center">
            <div class="flex">
                <div class="w-16 h-16 relative group">
                    <img :src="forceThunm ? forceThunm : songData.thumbnails[0].url" alt="Song"
                        class="w-full h-full rounded-lg overflow-auto group-hover:blur-sm transition-all" />
                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <v-icon name="bi-play-fill" color="white" class="rounded-full bg-gray-950 p-1 cursor-pointer"
                            scale="1.5" />
                    </div>
                </div>

                <div class="ml-2">
                    <div class="font-semibold cursor-pointer text-lg mt-2">{{ songData.title }}</div>
                    <div class="flex opacity-50 gap-2">
                        <router-link v-for="i in songData.artists" :to="'/artist/' + i.id"
                            class="font-bold  hover:underline cursor-pointer">{{ i.name }}</router-link>
                        <div class="font-extrabold">·</div>
                        <router-link :to="'/album/' + albumData().id"
                            class="font-semibold hover:underline cursor-pointer">{{
                                albumData().name }}</router-link>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="mr-10">
                    {{ songData.views }} vues
                </div>
                <div class="mr-4">
                    {{ (songData as Track).duration }}
                </div>
            </div>
        </div>
        <hr class="h-[1px] bg-white border-none" />

    </div>
</template>
<script lang="ts">
import router from '@/router';
import type { Album, SongResult, Track } from '@/type';



export interface SongData {
    id: number;
    name: string;
    icon: string;
}

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
    methods: {
        albumData(): Album {
            return this.forceAlbumData ? this.forceAlbumData : this.songData.album as any
        }
    }
}

</script>