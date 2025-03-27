<template></template>


<script lang="ts">
import type { AlbumData } from '@/components/AlbumData.vue';


export default {
    props: {
        albumData: {
            type: Object as () => AlbumData,
            required: true
        }
    }
}
</script>