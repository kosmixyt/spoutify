import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Artist from "@/views/Artist.vue";
import Album from "@/views/Album.vue";
import Search from "@/views/Search.vue";
import Offline from "@/views/Offline.vue";
import Login from "@/views/Login.vue";
import { checkAuthStatus } from "@/api";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Landing,
      meta: { requiresAuth: true },
    },
    {
      path: "/artist/:id",
      name: "Artist",
      component: Artist,
      meta: { requiresAuth: true },
    },
    {
      path: "/album/:id",
      name: "album",
      component: Album,
      meta: { requiresAuth: true },
    },
    {
      path: "/search/",
      name: "Search",
      component: Search,
      meta: { requiresAuth: true },
    },
    {
      path: "/offline",
      name: "Offline",
      component: Offline,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { requiresAuth: false },
    },
  ],
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuthStatus();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in
    if (!isAuthenticated) {
      // Not logged in, redirect to login page
      next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
      // Logged in, proceed as normal
      next();
    }
  } else {
    // No auth required, or it's the login page
    // If logged in and trying to access login page, redirect to home
    if (to.path === "/login" && isAuthenticated) {
      next({ path: "/" });
    } else {
      next();
    }
  }
});

export default router;
