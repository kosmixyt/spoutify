<template>
    <div class="content-item" @click="navigate">
        <div class="thumbnail-container">
            <img :src="thumb().url" alt="Thumbnail" class="thumbnail bg-black" />
            <div class="play-overlay">
                <div class="play-icon">▶</div>
            </div>
        </div>
        <div class="content-title">{{ content.title }}</div>
        <div class="content-subtitle" v-if="content.artists && content.artists.length > 0">
            {{ content.artists[0].name }}
        </div>
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
            const forward = {
                name: 'album',
                params: {
                    id: this.content.browseId || this.content.playlistId || this.content.audioPlaylistId,
                },
                query: {
                }
            }
            if (this.content.playlistId) {
                //@ts-ignore
                forward.query.isPlaylist = true;
            }

            this.$router.push(forward);
        }
    }
});
</script>

<style scoped>
.content-item {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 10px;
    background: rgba(30, 25, 40, 0.6);
    padding: 14px;
    box-sizing: border-box;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
}

.content-item:hover {
    transform: translateY(-8px);
    background: rgba(40, 35, 60, 0.8);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
}

.thumbnail-container {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 6px;
    margin-bottom: 12px;
    box-sizing: border-box;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    object-position: center;
    transition: transform 0.6s ease;
}

.content-item:hover .thumbnail {
    transform: scale(1.08);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.3s ease;
}

.content-item:hover .play-overlay {
    opacity: 1;
}

.play-icon {
    background: rgba(255, 255, 255, 0.9);
    color: #111;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    transform: scale(0.8);
    transition: all 0.3s ease;
}

.content-item:hover .play-icon {
    transform: scale(1);
}

.content-title {
    font-weight: 600;
    font-size: 15px;
    color: white;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.content-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
}

/* Media queries for small screens */
@media (max-width: 480px) {
    .content-item {
        padding: 10px;
        border-radius: 8px;
    }

    .thumbnail-container {
        border-radius: 5px;
        margin-bottom: 8px;
    }

    .content-title {
        font-size: 13px;
    }

    .content-subtitle {
        font-size: 11px;
        margin-top: 2px;
    }

    .play-icon {
        width: 32px;
        height: 32px;
        font-size: 14px;
    }
}

@media (max-width: 320px) {
    .content-item {
        padding: 8px;
        border-radius: 6px;
    }

    .thumbnail-container {
        border-radius: 4px;
        margin-bottom: 6px;
    }

    .content-title {
        font-size: 12px;
    }

    .content-subtitle {
        font-size: 10px;
        margin-top: 1px;
    }

    .play-icon {
        width: 28px;
        height: 28px;
        font-size: 12px;
    }
}

@media (max-width: 240px) {
    .content-item {
        padding: 5px;
        border-radius: 5px;
    }

    .thumbnail-container {
        margin-bottom: 4px;
    }

    .content-title {
        font-size: 11px;
    }

    .content-subtitle {
        display: none;
    }

    .play-icon {
        width: 24px;
        height: 24px;
        font-size: 10px;
    }
}
</style>
