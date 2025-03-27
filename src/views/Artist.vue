<template>
<div class="relative w-[calc(100vw-240px)] left-[calc(240px)]">
    <img :src="nekfeu" alt="Nekfeu" class="w-full object-cover h-80" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black">
        <div class="max-w-7xl mx-auto text-white flex flex-col xl:flex-row items-start xl:items-end xl:justify-between px-10 xl:px-40 h-full">
            <div class="mt-auto">
                <div class="font-bold text-4xl xl:text-6xl">Nekfeu</div>
                <div class="text-sm xl:text-base mt-2">2,345,678 monthly listeners</div>
            </div>
            <div class="mt-4 xl:mt-0">
                <button class="bg-green-500 text-black font-bold py-2 px-6 rounded-full hover:bg-green-600">
                    Play
                </button>
            </div>
        </div>
    </div>
    <div class="w-full bg-black bg-opacity-80">
        <div class="max-w-7xl mx-auto px-10 xl:px-40 py-6">
            <h2 class="text-white text-2xl font-bold mb-4">Most Streamed Songs</h2>
            <ul class="text-white space-y-4">
                <li class="flex items-center justify-between">
                    <span>1. On Verra</span>
                    <span>123,456,789 streams</span>
                </li>
                <li class="flex items-center justify-between">
                    <span>2. Ma Dope</span>
                    <span>98,765,432 streams</span>
                </li>
                <li class="flex items-center justify-between">
                    <span>3. Reuf</span>
                    <span>87,654,321 streams</span>
                </li>
                <li class="flex items-center justify-between">
                    <span>4. Tempête</span>
                    <span>76,543,210 streams</span>
                </li>
                <li class="flex items-center justify-between">
                    <span>5. Égérie</span>
                    <span>65,432,109 streams</span>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script lang="ts">
import nekfeu from "../assets/nekfeu.jpg";
export default {
  data: () => ({
    nekfeu,
  }),
};
</script>
