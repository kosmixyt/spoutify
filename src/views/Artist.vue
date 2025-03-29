<template>
  <div v-if="loading" class="px-0 xl:px-40 py-6">
    <!-- Hero section skeleton -->
    <div class="relative mb-10">
      <v-skeleton-loader type="image" height="320px" class="w-full rounded-lg"></v-skeleton-loader>
      <div class="absolute bottom-6 left-6 flex items-end gap-4">
        <v-skeleton-loader type="avatar" width="140px" height="140px" class="rounded-full"></v-skeleton-loader>
        <div>
          <v-skeleton-loader type="text" width="200px" height="42px" class="mb-2"></v-skeleton-loader>
          <v-skeleton-loader type="text" width="140px"></v-skeleton-loader>
        </div>
      </div>
    </div>

    <!-- About section skeleton -->
    <div class="mb-10">
      <v-skeleton-loader type="text" width="100px" class="mb-4"></v-skeleton-loader>
      <v-skeleton-loader type="paragraph" class="mb-4"></v-skeleton-loader>
    </div>

    <div class="border-b border-gray-800 mb-8"></div>

    <!-- Songs skeleton -->
    <div class="mb-10">
      <v-skeleton-loader type="text" width="180px" class="mb-4"></v-skeleton-loader>
      <div class="flex flex-col gap-2">
        <v-skeleton-loader v-for="i in 5" :key="`song-${i}`" type="list-item-two-line"></v-skeleton-loader>
      </div>
    </div>

    <!-- Albums skeleton -->
    <div class="mb-10">
      <v-skeleton-loader type="text" width="100px" class="mb-4"></v-skeleton-loader>
      <div class="flex gap-4 overflow-hidden">
        <v-skeleton-loader v-for="i in 5" :key="`album-${i}`" type="card" width="160px"
          height="200px"></v-skeleton-loader>
      </div>
    </div>

    <!-- Clips skeleton -->
    <div class="mb-10">
      <v-skeleton-loader type="text" width="80px" class="mb-4"></v-skeleton-loader>
      <div class="flex gap-4 overflow-hidden">
        <v-skeleton-loader v-for="i in 4" :key="`clip-${i}`" type="card" width="256px"
          height="180px"></v-skeleton-loader>
      </div>
    </div>
  </div>
  <div v-else-if="Object.keys(data).length == 0" class="flex justify-center items-center min-h-screen">
    <div class="text-gray-400 text-xl">Artist not found</div>
  </div>
  <div v-else class="relative">
    <img :src="getLargestThumb()" :alt="data.name" class="w-full object-cover h-80" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950">
      <div
        class="text-white flex flex-col xl:flex-row items-start xl:items-end xl:justify-between px-10 xl:px-40 h-full">
        <div class="flex items-center gap-2">
          <img :src="data.thumbnails[0].url" :alt="data.name"
            class="w-40 h-40 object-cover rounded-full border-4 border-green-500" />
          <div>
            <div class="font-bold text-4xl xl:text-6xl">{{ data.name }}</div>
            <div class="text-sm xl:text-base mt-2">2,345,678 monthly listeners</div>
          </div>
        </div>
        <div class="mt-4 xl:mt-0">
          <button class="bg-green-500 text-black font-bold py-2 px-6 rounded-full hover:bg-green-600 shadow-lg">
            Play
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Artist description section - redesigned -->
  <div class="px-10 xl:px-40 py-10">
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <div class="w-full md:w-2/3">
        <h2 class="text-white text-2xl font-bold mb-4 flex items-center">
          <span class="mr-2">About</span>
          <span class="h-px bg-gray-700 flex-grow ml-4 hidden md:block"></span>
        </h2>
        <div v-if="data.description" class="text-gray-300 leading-relaxed">
          <div v-if="!showFullDescription && formattedDescription.length > 300">
            <p v-html="truncatedDescription" class="mb-3"></p>
            <button @click="showFullDescription = true"
              class="text-green-500 hover:text-green-400 font-medium flex items-center transition-all">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div v-else>
            <div v-html="formattedDescription" class="mb-3"></div>
            <button v-if="formattedDescription.length > 300" @click="showFullDescription = false"
              class="text-green-500 hover:text-green-400 font-medium flex items-center transition-all">
              Show less
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
        <p v-else class="text-gray-400 italic">No artist description available.</p>
      </div>

    </div>
  </div>

  <div class="border-b border-gray-800 mx-10 xl:mx-40"></div>

  <div class="py-10 mb-28">
    <div class="w-full mx-auto">
      <h2 class="text-white text-xl font-bold mb-4">Most Streamed Songs</h2>
      <div>
        <LineSong :song-data="i" v-for="i in data.songs.results" />
      </div>
    </div>
    <div>
      <h2 class="text-white text-xl font-bold mb-4">Albums</h2>
      <!-- <swiper class="w-full mx-auto" :slides-per-view="'auto'" :space-between="10"> -->
      <!-- <SwiperSlide class="w-fit" v-for="album in data.albums.results" :key="album"> -->
      <Swiper :slides-per-view="'auto'" :space-between="10">
        <SwiperSlide class="!w-40" v-for="album in data.albums.results">
          <AlbumData :album-data="album" />
        </SwiperSlide>
      </Swiper>
      <!-- </SwiperSlide> -->
      <!-- </swiper> -->
    </div>
    <div class="mt-4">
      <h2 class="text-white text-xl font-bold mb-4">Clips</h2>
      <!-- <swiper class="w-full mx-auto" :slides-per-view="'auto'" :space-between="10"> -->
      <!-- <SwiperSlide class="w-fit" v-for="album in data.albums.results" :key="album"> -->
      <div class="overflow-hidden">
        <Swiper :slides-per-view="'auto'" :space-between="10" class="w-full mx-auto">
          <SwiperSlide class="!w-64 shrink-0" v-for="video in data.videos.results" :key="video">
            <Clip :videoData="video" />
          </SwiperSlide>
        </Swiper>
      </div>
      <!-- </SwiperSlide> -->
      <!-- </swiper> -->
    </div>
  </div>
</template>
<script lang="ts">
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AlbumData from "@/components/AlbumData.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import LineSong from '@/components/LineSong.vue';
import type { MainArtist } from '@/type';
import { GetArtist, getLargestThumbnail } from '@/api';
import router from '@/router';
import Clip from '@/components/Clip.vue';

export default {
  components: {
    AlbumData,
    Clip,
    LineSong,
    Swiper,
    SwiperSlide
  },
  data: () => {
    return {
      loading: true,
      data: {} as MainArtist,
      showFullDescription: false
    }
  },
  computed: {
    formattedDescription() {
      if (!this.data.description) return '';
      return this.data.description
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '')
        .trim();
    },
    truncatedDescription() {
      if (!this.formattedDescription) return '';
      return this.formattedDescription.substring(0, 300) + '...';
    }
  },
  methods: {
    getLargestThumb() {
      return getLargestThumbnail(this.data.thumbnails);
    }
  },
  mounted() {
    // console.log(this.data.songs.results)
    document.body.style.overflowX = 'hidden';
  },
  beforeDestroy() {
    document.body.style.overflowX = 'auto';
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      async handler() {
        if (!this.$route.params.id) router.push('/');
        this.loading = true;
        this.data = await GetArtist(this.$route.params.id as string);
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Add custom styling for v-skeleton-loader */
:deep(.v-skeleton-loader__image),
:deep(.v-skeleton-loader__avatar),
:deep(.v-skeleton-loader__text),
:deep(.v-skeleton-loader__paragraph),
:deep(.v-skeleton-loader__list-item-two-line),
:deep(.v-skeleton-loader__card) {
  @apply bg-gray-800;
}

:deep(.v-skeleton-loader__bone) {
  background-image: linear-gradient(90deg, rgba(55, 65, 81, 0.3), rgba(75, 85, 99, 0.5), rgba(55, 65, 81, 0.3));
}
</style>
