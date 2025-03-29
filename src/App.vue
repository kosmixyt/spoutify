<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex bg-gray-950">
    <div>
      <div
        class="w-screen text-white h-14 flex z-50 fixed items-center justify-between backdrop-blur-md bg-gray-950/80 shadow-md transition-all">
        <div class="ml-6">
          <div class="relative">
            <v-icon name="fa-search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              scale="1" />
            <input v-model="searchData" v-on:input="search" type="text" placeholder="Search..."
              class="text-white pl-10 pr-4 py-2 rounded-full h-9 bg-[#2a2a2a] hover:bg-[#333333] focus:bg-[#333333] focus:outline-none focus:ring-1 focus:ring-green-500 transition-all w-64" />
          </div>
        </div>
        <div class="mr-6">
          <div class="bg-[#2a2a2a] hover:bg-[#333333] rounded-full p-1.5 cursor-pointer transition-all hover:scale-105">
            <v-icon name="fa-user-circle" class="text-white" scale="1.5" />
          </div>
        </div>
      </div>
      <div class="mt-[48px] w-60 hidden md:block  bg-gray-950 z-40 h-screen fixed">
        <div class="flex flex-col space-y-4 p-4">
          <RouterLink to="/" class="flex items-center space-x-2 text-white hover:text-gray-400">
            <v-icon name="fa-home" scale="1.5" />
            <span class="text-sm">Home</span>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="md:ml-[240px] md:w-[calc(100vw-240px)] mt-[56px] ml-0 w-screen px-2 md:px-0">
      <RouterView />
    </div>
  </div>
  <GlobalAudioPlayer />
</template>

<script lang="ts">
export default {

  data() {
    return {
      searchData: '',
    }
  },
  mounted() {
    // this.$router.beforeEach((to, from, next) => {
    //   if (to.path === '/search') {
    //     this.searchData = to.query.q || ''
    //   }
    //   next()
    // })
    if (this.$route.query.q) {
      this.searchData = this.$route.query.q as string
    }
  },
  methods: {
    search() {
      this.$router.push({ path: '/search', query: { q: this.searchData } })
    }
  },
}
</script>
