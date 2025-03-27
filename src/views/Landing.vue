<template>
  <Teleport to="body">
    <div class="mt-[calc(48px)] relative w-[calc(100vw-240px)] left-[calc(240px)] pl-4">
      <div class="flex justify-between">
        <div class="text-2xl font-semibold underline text-white">
          Reprendre la lecture :
        </div>
        <div class="flex gap-2">
          <div>
            <v-icon name="bi-forward" color="white" class="rounded-3xl border-2 rotate-180 cursor-pointer" scale="2"/>
          </div>
          <div>
            <v-icon name="bi-forward" color="white" class="rounded-3xl border-2 cursor-pointer" scale="2"/>
          </div>
        </div>
      </div>
      <div class="mt-6 overflow-auto flex gap-2 no-scrollbar">
        <AlbumData v-for="i in 6" :album-data="{ 'id': 1000, name: 'Guillaume la merde' }" />
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts">
import AlbumData from '@/components/AlbumData.vue';
import { Teleport } from 'vue';

export default {
  components: {
    Teleport,
    AlbumData
  }
}
</script>
