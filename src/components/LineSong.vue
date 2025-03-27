<template>
    <div draggable="true">
        <div class="flex justify-between mt-1 mb-1 text-white items-center">
            <div class="flex">
                <div class="w-16 h-16 relative group">
                    <img :src="songData.icon" alt="Song"
                        class="w-full h-full rounded-lg overflow-auto group-hover:blur-sm transition-all" />
                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <v-icon name="bi-play-fill" color="white" class="rounded-full bg-gray-950 p-1 cursor-pointer"
                            scale="1.5" />
                    </div>
                </div>

                <div class="ml-2">
                    <div class="font-semibold cursor-pointer text-lg mt-2">Salut</div>
                    <div class="flex opacity-50 gap-2">
                        <router-link to="/artist" class="font-bold  hover:underline cursor-pointer">Ziak</router-link>
                        <div class="font-extrabold">·</div>
                        <router-link to="/album"
                            class="font-semibold hover:underline cursor-pointer">Quatre</router-link>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="mr-10">
                    5,1 M de vues
                </div>
                <div class="mr-4">
                    2:34
                </div>
            </div>
        </div>
        <hr class="h-[1px] bg-white border-none" />

    </div>
</template>
<script lang="ts">
import router from '@/router';



export interface SongData {
    id: number;
    name: string;
    icon: string;
}

export default {
    props: {
        songData: {
            type: Object as () => SongData,
            required: false,
            default: {
                id: 0,
                name: "Columbine",
                icon: "https://lh3.googleusercontent.com/YQcStMjFgafbp_yMOyEqkLQ3wSdrQRMH6s6ismKnVw5qlQogvkev0c5-_L_mZ9MqL8to5cU0bE1M-EQ=w544-h544-l90-rj"
            }
        }
    }
}

</script>