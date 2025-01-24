<template>
<div class="w-screen relative">
    <img :src="nekfeu" alt="Nekfeu" class="w-full object-cover" />
<div class="top-[60%] h-[40%] bg-gradient-to-b from-transparent to-black xl:top-3/4 xl:h-1/4 absolute w-screen">
    <div class="text-white">
        <div class="font-bold text-2xl xl:text-3xl ml-10 xl:ml-40">Nekfeu</div>
    </div>
</div>
</div>
</template>
<script lang="ts">
import nekfeu from "../assets/nekfeu.jpg";
export default {
  props: {},
  data: () => {
    return {
      nekfeu,
    };
  },
  mounted() {},
};
</script>
