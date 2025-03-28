<template>
  <div v-if="loading">Loading</div>
  <div v-else class="relative overflow-x-hidden">
    <img :src="getLargestThumb()" alt="Nekfeu" class="w-full object-cover h-80" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950">
      <div
        class="text-white flex flex-col xl:flex-row items-start xl:items-end xl:justify-between px-10 xl:px-40 h-full">
        <div class="flex items-center gap-2">
          <img :src="data.thumbnails[0].url" alt="Nekfeu"
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
      <swiper class="w-full mx-auto" :slides-per-view="'auto'" :space-between="10">
        <SwiperSlide v-for="album in [1, 2, 34, 54, 5]" :key="album">
          <!-- <AlbumData :albumData="{ : album.toString(), id: 1021821 }" /> -->
        </SwiperSlide>
      </swiper>
    </div>
  </div>
</template>
<script lang="ts">
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import nekfeu from "../assets/nekfeu.jpg";
import AlbumData from "@/components/AlbumData.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import LineSong from '@/components/LineSong.vue';
import type { MainArtist } from '@/type';
import { GetArtist, getLargestThumbnail } from '@/api';
import router from '@/router';

export default {
  components: {
    AlbumData,
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
  watch: {
    '$route.params.id': {
      immediate: true,
      async handler() {
        if (!this.$route.params.id) router.push('/');
        this.loading = true;
        console.log(this.$route.params.id);
        this.data = await GetArtist(this.$route.params.id as string);
        console.log(this.data);
        this.loading = false;
        // this.getArtistData(this.$route.params.id);
      }
    }
  }
};
</script>
