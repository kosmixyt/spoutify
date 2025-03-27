<template>
    <div>
        <div class="flex justify-center">
            <div @contextmenu.prevent="onRightClick">
                <img src="https://picsum.photos/200/200?random=3" alt="Album"
                    class="w-56 h-56 object-cover rounded-lg" />
            </div>
            <div class="text-white flex flex-col items-center justify-center">
                <div class="ml-3 opacity-50">Album</div>
                <div class="ml-6 text-6xl font-extrabold hover:underline">Feu</div>
                <div class="flex flex-col gap-1 opacity-50 ml-3 items-center mt-4">
                    <div class="flex items-center gap-2">
                        <div class="hover:underline cursor-pointer flex items-center">
                            <div>
                                <img src="https://picsum.photos/200/200?random=3" alt="Album"
                                    class="w-8 h-8 object-cover rounded-full" />
                            </div>
                            <router-link to="/artist" class="ml-2">Nekfeu</router-link>
                        </div>
                        <div>2015</div>
                    </div>
                    <div class="flex gap-2">
                        <div>18 titres</div>
                        <div>1h 19 min</div>
                    </div>
                </div>
                <div class="flex gap-4 mt-6 ml-8">
                    <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600">
                        Play
                    </button>
                    <button class="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">
                        Download
                    </button>
                </div>
            </div>

        </div>
        <div class="w-[95%] mx-auto mt-8">
            <LineSong v-for="i in 10" />
        </div>
    </div>
</template>


<script lang="ts">
import type { AlbumData } from '@/components/AlbumData.vue';
import LineSong from '@/components/LineSong.vue';

export default {
    components: {
        LineSong
    },
    props: {
        albumData: {
            type: Object as () => AlbumData,
            required: true
        }
    },
    methods: {
        onRightClick(event: MouseEvent) {
            alert('Clic droit personnalisé sur l\'image de l\'album');
        }
    }
}
</script>