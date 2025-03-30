<template>
  <div class="landing-container">
    <!-- Hero section -->
    <div class="hero-section">
      <h1 class="hero-title">Découvrez votre musique</h1>
      <p class="hero-subtitle">Explorez des millions de titres et d'albums</p>
    </div>

    <!-- Loading state -->
    <div v-if="Object.keys(homeData).length === 0" class="loading-container">
      <div class="loading-animation">
        <div class="pulse-ring"></div>
        <div class="pulse-dot"></div>
      </div>
      <p class="loading-text">Chargement de votre bibliothèque musicale...</p>
    </div>

    <!-- Main content -->
    <div v-else class="home-content">
      <div class="home-section" v-for="(section, index) in homeData" :key="index">
        <div class="section-header">
          <h2 class="section-title">{{ section.title }}</h2>
          <button class="section-more-btn" v-if="section.contents.length > 5">
            Tout afficher
            <span class="icon">›</span>
          </button>
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
  padding: 0;
  background: linear-gradient(180deg, #111016 0%, #1e1333 100%);
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hero section */
.hero-section {
  background: linear-gradient(135deg, rgba(88, 56, 163, 0.9) 0%, rgba(22, 11, 54, 0.95) 100%),
    url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&w=1200') center/cover no-repeat;
  padding: 80px 40px;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
}

.hero-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(to top, #111016, transparent);
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #fff, #c2a8fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* Loading animation */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 350px;
  padding: 20px;
}

.loading-animation {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #9370DB;
  opacity: 0;
  animation: pulse 1.5s ease-out infinite;
}

.pulse-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #9370DB, #6A1B9A);
  border-radius: 50%;
  box-shadow: 0 0 15px #9370DB;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #b19cd9;
  text-align: center;
}

/* Main content */
.home-content {
  padding: 0 40px 60px;
  animation: fadeUp 0.8s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-section {
  margin-bottom: 50px;
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 5px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  position: relative;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  display: block;
  width: 6px;
  height: 25px;
  background: linear-gradient(to bottom, #9370DB, #6A1B9A);
  margin-right: 12px;
  border-radius: 4px;
}

.section-more-btn {
  background: transparent;
  border: none;
  color: #b19cd9;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.section-more-btn:hover {
  background: rgba(147, 112, 219, 0.1);
  color: #d7c2ff;
}

.section-more-btn .icon {
  font-size: 1.2rem;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.section-more-btn:hover .icon {
  transform: translateX(4px);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 5px;
}

/* Media queries */
@media (max-width: 960px) {
  .hero-section {
    padding: 60px 30px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .home-content {
    padding: 0 30px 40px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 50px 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }

  .home-content {
    padding: 0 20px 30px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 15px;
  }

  .hero-title {
    font-size: 1.7rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .section-title::before {
    width: 4px;
    height: 20px;
    margin-right: 8px;
  }

  .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .home-content {
    padding: 0 15px 20px;
  }

  .loading-animation {
    width: 60px;
    height: 60px;
  }

  .pulse-dot {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 320px) {
  .hero-section {
    padding: 30px 10px;
  }

  .hero-title {
    font-size: 1.4rem;
  }

  .hero-subtitle {
    font-size: 0.8rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .section-more-btn {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .home-content {
    padding: 0 10px 15px;
  }
}

@media (max-width: 240px) {
  .hero-section {
    padding: 20px 5px;
  }

  .hero-title {
    font-size: 1.2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-more-btn {
    margin-top: 5px;
    font-size: 0.7rem;
  }
}
</style>
