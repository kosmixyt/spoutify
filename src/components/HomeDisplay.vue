<template>
    <div class="content-item" @click="navigate">
        <img :src="thumb().url" alt="Thumbnail" class="thumbnail" />
        <div class="content-title">{{ content.title }}</div>
    </div>
</template>

<script lang="ts">
import { getBestQualitythumbnail } from '@/api';
import { playTrack, type PlayerServiceRequest } from '@/services/playerService';
import type { Content } from '@/type';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeDisplay',
    props: {
        contents: {
            type: Object as () => Content,
            required: true
        }
    },
    computed: {
        content() {
            return this.contents;
        }
    },
    methods: {
        navigateToPlaylist(playlistId: string) {
            // Navigation implementation
        },
        thumb() {
            return getBestQualitythumbnail(this.content.thumbnails);
        },
        navigate() {
            if (this.content.videoId) {
                const track: PlayerServiceRequest = {
                    Artists: this.content.artists ?? [],
                    cover: getBestQualitythumbnail(this.content.thumbnails)?.url,
                    title: this.content.title,
                    videoId: this.content.videoId,
                }
                playTrack(track);
            }
            this.$router.push({
                name: 'album',
                params: {
                    id: this.content.browseId || this.content.playlistId || this.content.audioPlaylistId,
                    isPlaylist: "true"
                }
            });
        }
    }
});
</script>

<style scoped>
.content-item {
    transition: all 0.3s ease;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.content-item:hover {
    transform: translateY(-8px) scale(1.03);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.thumbnail {
    width: 100%;
    border-radius: 4px;
    margin-bottom: 10px;
}

.content-title {
    font-weight: 600;
    font-size: 14px;
    color: white;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
