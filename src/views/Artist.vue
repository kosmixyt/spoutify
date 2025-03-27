<template>
  <div class="relative overflow-x-hidden">
    <img :src="nekfeu" alt="Nekfeu" class="w-full object-cover h-80" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black">
      <div
        class="text-white flex flex-col xl:flex-row items-start xl:items-end xl:justify-between px-10 xl:px-40 h-full">
        <div>
          <div class="font-bold text-4xl xl:text-6xl">Nekfeu</div>
          <div class="text-sm xl:text-base mt-2">2,345,678 monthly listeners</div>
        </div>
        <div class="mt-4 xl:mt-0">
          <button class="bg-green-500 text-black font-bold py-2 px-6 rounded-full hover:bg-green-600 shadow-lg">
            Play
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="py-6">
    <div class="w-full mx-auto">
      <h2 class="text-white text-xl font-bold mb-4">Most Streamed Songs</h2>
      <div>
        <LineSong v-for="i in [1, 2, 4, 5, 8, 9]" />
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import LineSong from "@/components/LineSong.vue";
import nekfeu from "../assets/nekfeu.jpg";
import AlbumData from "@/components/AlbumData.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
  components: {
    AlbumData,
    LineSong,
    Swiper,
    SwiperSlide
  },
  data: () => ({
    nekfeu,
    albums: [
      { id: 1, name: "Adieu Bientôt" },
      { id: 2, name: "Cyborg" },
      { id: 3, name: "Feu" },
      { id: 4, name: "Les étoiles vagabondes" },
    ],
  }),
  setup() {
    return {
    };
  },
};
</script>
