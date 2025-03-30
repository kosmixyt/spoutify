<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import router from './router';

const isActive = (is: string) => {
  const route = useRoute()
  return route.path === is
}

const isMobileSidebarOpen = ref(false)
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}
</script>

<template>
  <div class="flex bg-[#0c0414] relative">
    <!-- Semi-transparent overlay when sidebar is open on mobile -->
    <div v-if="isMobileSidebarOpen" @click="toggleMobileSidebar"
      class="md:hidden fixed inset-0 bg-black bg-opacity-70 z-30 transition-opacity duration-300"></div>

    <div>
      <div
        class="w-screen text-white h-14 flex z-50 fixed items-center justify-between backdrop-blur-md bg-[#0c0414]/80 shadow-md transition-all">
        <div class="ml-6 flex items-center">
          <!-- Mobile sidebar toggle button -->
          <div @click="toggleMobileSidebar" class="mr-3 md:hidden cursor-pointer">
            <v-icon :name="isMobileSidebarOpen ? 'fa-arrow-left' : 'fa-arrow-right'" class="text-white" scale="1.2" />
          </div>
          <div class="relative">
            <v-icon name="fa-search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              scale="1" />
            <input ref="search" v-model="searchData" v-on:input="search" type="text" placeholder="Search..."
              class="text-white pl-10 pr-4 py-2 rounded-full h-9 bg-[#1a0b2e] hover:bg-[#250e3d] focus:bg-[#250e3d] focus:outline-none focus:ring-1 focus:ring-violet-600 transition-all w-64" />
          </div>
        </div>
        <div class="mr-6">
          <div class="bg-[#1a0b2e] hover:bg-[#250e3d] rounded-full p-1.5 cursor-pointer transition-all hover:scale-105">
            <v-icon name="fa-user-circle" class="text-white" scale="1.5" />
          </div>
        </div>
      </div>
      <!-- Modified sidebar with mobile overlay support -->
      <div class="mt-[48px] w-60 bg-[#0c0414] z-40 h-screen fixed transition-all duration-300 shadow-lg" :class="{
        'translate-x-0': isMobileSidebarOpen || window.innerWidth >= 768,
        '-translate-x-full': !isMobileSidebarOpen && window.innerWidth < 768,
        'md:translate-x-0': true,
        'md:block': true
      }">
        <div class="p-5">
          <div class="text-white font-bold text-2xl mb-6 flex items-center">
            <v-icon name="fa-music" class="text-violet-500 mr-2" scale="1.2" />
            <span>Spoutify</span>
          </div>

          <div class="flex flex-col space-y-2">
            <div class="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider pl-3">Main</div>

            <RouterLink @click="isMobileSidebarOpen = false" to="/" :class="{
              'bg-[#1a0b2e] text-white': isActive('/'),
              'text-gray-300 hover:text-white': !isActive('/')
            }" class="flex items-center py-2.5 px-3 rounded-md transition-all duration-200 group">
              <div class="flex items-center">
                <div :class="{ 'text-violet-500': isActive('/') }" class="mr-3 transition-colors duration-200">
                  <v-icon name="fa-home" scale="1.2" />
                </div>
                <span class="text-sm font-medium">Home</span>
              </div>
              <div v-if="isActive('/')" class="ml-auto h-2 w-2 rounded-full bg-violet-600"></div>
            </RouterLink>

            <RouterLink @click="isMobileSidebarOpen = false" to="/library" :class="{
              'bg-[#1a0b2e] text-white': isActive('/library'),
              'text-gray-300 hover:text-white': !isActive('/library')
            }" class="flex items-center py-2.5 px-3 rounded-md transition-all duration-200 group">
              <div :class="{ 'text-violet-500': isActive('/library') }" class="mr-3 transition-colors duration-200">
                <v-icon name="fa-book" scale="1.2" />
              </div>
              <span class="text-sm font-medium">Library</span>
            </RouterLink>

            <RouterLink @click="isMobileSidebarOpen = false; focusSearch()" to="/search" :class="{
              'bg-[#1a0b2e] text-white': $route.path === '/search',
              'text-gray-300 hover:text-white': $route.path !== '/search'
            }" class="flex items-center py-2.5 px-3 rounded-md transition-all duration-200 group">
              <div :class="{ 'text-violet-500': isActive('/search') }" class="mr-3 transition-colors duration-200">
                <v-icon name="fa-search" scale="1.2" />
              </div>
              <span class="text-sm font-medium">Search</span>
            </RouterLink>

            <RouterLink v-if="isNative()" @click="isMobileSidebarOpen = false" to="/offline" :class="{
              'bg-[#1a0b2e] text-white': isActive('/offline'),
              'text-gray-300 hover:text-white': !isActive('/offline')
            }" class="flex items-center py-2.5 px-3 rounded-md transition-all duration-200 group">
              <div :class="{ 'text-violet-500': isActive('/offline') }" class="mr-3 transition-colors duration-200">
                <v-icon name="fa-download" scale="1.2" />
              </div>
              <span class="text-sm font-medium">Offline</span>
            </RouterLink>

            <div class="mt-6 pt-6 border-t border-gray-800">
              <div class="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider pl-3">Playlists</div>
              <div class="text-gray-400 hover:text-white py-2 px-3 text-sm cursor-pointer transition-colors">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded bg-gradient-to-br from-violet-700 to-violet-900 mr-3 flex items-center justify-center">
                    <v-icon name="fa-plus" scale="0.8" class="text-white" />
                  </div>
                  <span>Create Playlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Remove the conditional margin for mobile -->
    <div class="md:ml-[240px] md:w-[calc(100vw-240px)] mt-[56px] px-1 w-screen md:px-0">
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
      window: window,
    }
  },
  mounted() {
    if (this.$route.query.q) {
      this.searchData = this.$route.query.q as string
    }
    if (Capacitor.isNativePlatform()) {
      App.addListener("backButton", (data) => {
        if (data.canGoBack) {
          this.$router.back()
        } else {
          App.exitApp();
        }
      });
    }

  },
  methods: {
    isNative() {
      return Capacitor.isNativePlatform()
    },
    search() {
      this.$router.push({ path: '/search', query: { q: this.searchData } })
    },
    focusSearch() {
      const searchInput = this.$refs.search as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    },
  },
}
</script>

<style>
.router-link-active {
  font-weight: 600;
}
</style>
