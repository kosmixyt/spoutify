<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex">
    <div>
      <div class="w-screen text-white h-12 bg-gray-950 flex z-50 absolute items-center justify-between">
        <div class="ml-4">
          <input type="text" placeholder="Search..." class="text-white pl-3 rounded-lg h-8 bg-[#181818]"/>
        </div>
        <div class="mr-4">
          <v-icon  name="fa-user-circle" class="color cursor-pointer" scale="1.8"/>
        </div>
      </div>
      <div class="mt-[48px] w-60 bg-gray-950 z-40 h-screen fixed">
      </div>
    </div>
    <RouterView />
  </div>
</template>
