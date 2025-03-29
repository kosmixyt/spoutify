<template>
    <router-link :to="'/album/' + albumData.browseId"
        class="group block transition-transform hover:-translate-y-1 duration-200">
        <div class="relative overflow-hidden rounded-lg">
            <!-- Badge Explicit -->
            <ExternalLinkRedirector :force-confirm="true"
                href="https://support.deezer.com/hc/fr/articles/360000590898-Contenus-explicites-sur-Deezer">
                <div class="bg-gray-800/90 text-gray-200 rounded-md px-1.5 py-0.5 text-xs font-medium absolute top-2 left-2 shadow-sm border border-gray-700 z-10 backdrop-blur-sm"
                    v-if="albumData.isExplicit">E</div>
            </ExternalLinkRedirector>

            <!-- Image with hover effect -->
            <img :src="thumb().url" alt="Album"
                class="w-40 h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" />

            <!-- Hover overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
        </div>

        <div class="mt-2 text-white max-w-[160px]">
            <div class="text-lg font-semibold truncate group-hover:text-indigo-300 transition-colors duration-200">{{
                albumData.title }}</div>

            <div v-if="albumData.artists && albumData.artists.length" class="text-sm text-gray-300 truncate">
                <span v-for="(artist, index) in albumData.artists" :key="index">
                    <router-link :to="'/artist/' + artist.id" class="hover:underline">{{ artist.name
                    }}</router-link><span v-if="index < albumData.artists.length - 1">, </span>
                </span>
            </div>

            <span class="text-xs text-gray-400 uppercase tracking-wider">{{ albumData.type }}</span>
        </div>
    </router-link>
</template>

<script lang="ts">
import { getBestQualitythumbnail } from '@/api';
import type { MiniAlbum } from '@/type';
import ExternalLinkRedirector from './ExternalLinkRedirector.vue';

export default {
    components: {
        ExternalLinkRedirector
    },
    props: {
        albumData: {
            type: Object as () => MiniAlbum,
            required: true
        }
    },
    methods: {
        thumb() {
            return getBestQualitythumbnail(this.albumData.thumbnails)
        }
    }
}
</script>
