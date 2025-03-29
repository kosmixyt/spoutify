<template>
    <div v-if="Object.keys(videoData).length > 0"
        :class="['relative group transition-all duration-300 hover:scale-105 my-4', { 'border-container': isClicked }]"
        @click="toggleBorder; play">
        <div class="relative overflow-hidden rounded-lg hover:shadow-lg">
            <img :src="thumbnail?.url" alt="Video Thumbnail"
                class="w-full rounded-lg transition-transform duration-500 group-hover:blur-sm group-hover:brightness-75" />

            <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            </div>

            <div class="absolute bottom-0 w-full p-3 text-white">
                <h3 class="mb-1 truncate font-medium group-hover:text-white">{{ videoData.title || 'Untitled' }}</h3>

                <div class="flex items-center justify-between text-sm text-white/80 group-hover:text-white/95">
                    <div>{{ videoData.views }}</div>
                    <div class="flex flex-wrap justify-end">
                        <router-link v-for="(artist, index) in videoData.artists" :key="artist.id"
                            :to="'/artist/' + artist.id" class="font-medium hover:text-white hover:underline">
                            {{ artist.name }}{{ index < videoData.artists.length - 1 ? ', ' : '' }} </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isClicked" class="animated-border"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getBestQualitythumbnail } from '@/api';
import type { MiniVideo } from '@/type';
import { playTrack, type PlayerServiceRequest } from '@/services/playerService';

const props = defineProps<{
    videoData: MiniVideo
}>();

const thumbnail = computed(() => {
    return getBestQualitythumbnail(props.videoData.thumbnails);
});



const play = computed(() => {
    const track: PlayerServiceRequest = {
        Artists: props.videoData.artists,
        cover: getBestQualitythumbnail(props.videoData.thumbnails)?.url,
        title: props.videoData.title,
        videoId: props.videoData.videoId,
    }
    playTrack(track);
})

const isClicked = ref(false);

const toggleBorder = () => {
    isClicked.value = !isClicked.value;

};
</script>

<style scoped>
.border-container {
    position: relative;
}

.animated-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
    transform-origin: center;
    transition: transform 0.3s ease;
}

.animated-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 3px;
    background: linear-gradient(90deg,
            #ff0000, #ff7f00, #ffff00, #00ff00,
            #0000ff, #4b0082, #8b00ff, #ff0000);
    background-size: 400% 400%;
    animation: move-gradient 3s linear infinite;
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
}

@keyframes move-gradient {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 400% 50%;
    }
}
</style>
