<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex bg-gray-950">
    <div>
      <div class="w-screen text-white h-12  flex z-50 fixed items-center justify-between">
        <div class="ml-4">
          <input type="text" placeholder="Search..." class="text-white pl-3 rounded-lg h-8 bg-[#181818]" />
        </div>
        <div class="mr-4">
          <v-icon name="fa-user-circle" class="color cursor-pointer" scale="1.8" />
        </div>
      </div>
      <div class="mt-[48px] md:w-60  bg-gray-950 z-40 h-screen fixed">
      </div>
    </div>
    <div class="md:ml-[240px] md:w-[calc(100vw-240px)] mt-[48px] ml-0 w-screen px-2 md:px-0">
      <RouterView />
    </div>
  </div>
  <GlobalAudioPlayer />
</template>
