<template>
    <div class="cursor-pointer">
        <div class="min-w-52 w-52 h-52 min-h-52 bg-red-500 rounded-lg overflow-auto"
            :style="{ 'background-image': 'https://lh3.googleusercontent.com/YQcStMjFgafbp_yMOyEqkLQ3wSdrQRMH6s6ismKnVw5qlQogvkev0c5-_L_mZ9MqL8to5cU0bE1M-EQ=w544-h544-l90-rj' }">
        </div>
        <div class="text-white">
            <div class="text-lg underline font-semibold">Adieu Bientot :</div>
            <span class="opacity-35">Album data :</span> cocasse • <span>1k</span>
        </div>
    </div>
</template>
<script lang="ts">

export default {
    props: {
        albumData: {
            type: Object as () => AlbumData,
            required: true
        }
    }
}
export interface AlbumData {
    id: number;
    name: string
}
</script>
