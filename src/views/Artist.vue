<template>
    <div class="">
        <div ref="bg" class="w-screen h-screen cursor-pointer bg-cover">
        </div>
    </div>
</template>
<script lang="ts">
import nekfeu from "../assets/nekfeu.jpg"
export default {
    props: {
    },
    mounted(){
        console.log(nekfeu)
    this.$refs.bg.style.backgroundImage = `url(${nekfeu})`

    }
}
</script>