<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex bg-gray-950">
    <div>
      <div class="w-screen text-white h-12  flex z-50 fixed items-center justify-between">
        <div class="ml-4">
          <input v-model="searchData" v-on:input="search" type="text" placeholder="Search..."
            class="text-white pl-3 rounded-lg h-8 bg-[#181818]" />
        </div>
        <div class="mr-4">
          <v-icon name="fa-user-circle" class="color cursor-pointer" scale="1.8" />
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
    <div class="md:ml-[240px] md:w-[calc(100vw-240px)] mt-[48px] ml-0 w-screen px-2 md:px-0">
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
    console.log(this.$route.query.q)
    if (this.$route.query.q) {
      this.searchData = this.$route.query.q as string
    }
  },
  methods: {
    search() {
      console.log(this.searchData)
      this.$router.push({ path: '/search', query: { q: this.searchData } })
    }
  },
}
</script>
