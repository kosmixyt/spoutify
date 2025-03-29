<template>
  <div class="landing-container">
    <div v-if="Object.keys(homeData).length === 0" class="loading">
      <div class="spinner"></div>
      <p>Chargement de votre musique...</p>
    </div>
    <div v-else class="home-content">
      <div class="home-section" v-for="(section, index) in homeData" :key="index">
        <div class="section-header">
          <h2 class="section-title">{{ section.title }}</h2>
          <span class="section-more" v-if="section.contents.length > 5">Tout afficher</span>
        </div>
        <div class="content-grid">
          <HomeDisplay v-for="(content, idx) in section.contents" :key="`${index}-${idx}`" :contents="content" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { GetHome } from '@/api';
import AlbumData from '@/components/AlbumData.vue';
import Clip from '@/components/Clip.vue';
import HomeDisplay from '@/components/HomeDisplay.vue';
import type { Home } from '@/type';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    AlbumData,
    Clip,
    HomeDisplay
  },
  data: () => {
    return {
      homeData: [] as Home,
    };
  },
  methods: {
    async fetchHome() {
      try {
        this.homeData = await GetHome();
        console.log(this.homeData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    },
  },
  mounted() {
    this.fetchHome();
  },
});
</script>

<style scoped>
.landing-container {
  padding: 30px;
  background: linear-gradient(135deg, #0f1123 0%, #1a1b32 100%);
  min-height: 100vh;
  color: #fff;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #8a64ff;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(138, 100, 255, 0.3);
  border-top: 5px solid #8a64ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.home-content {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-section {
  margin-bottom: 40px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  position: relative;
  padding-left: 10px;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #8a64ff;
  border-radius: 2px;
}

.section-more {
  color: #c9c9f1;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.section-more:hover {
  color: #a78bfa;
  text-decoration: underline;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
  padding: 10px 0;
}

.content-item {
  transition: all 0.3s ease;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.content-item:hover {
  transform: translateY(-8px) scale(1.03);
  background: rgba(138, 100, 255, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
