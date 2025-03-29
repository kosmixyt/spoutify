<template>
  <div v-if="loading || Object.keys(data).length == 0" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
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
  <div class="py-6 mb-28">
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
