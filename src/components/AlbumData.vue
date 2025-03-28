<template>
    <div class="cursor-pointer">
        <img :src="`https://picsum.photos/200/200?random=`" alt="Album" class="w-40 h-40 object-cover rounded-lg" />
        <div class="text-white">
            <div class="text-lg underline font-semibold">Album name</div>
            <span class="opacity-35">Album data:</span> cocasse • <span>1k</span>
        </div>
    </div>
</template>
<script lang="ts">
import type { AlbumData } from '@/type';

export default {
    props: {
        albumData: {
            type: Object as () => AlbumData,
            required: true
        }
    }
}
</script>
