import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Artist from "@/views/Artist.vue";
import Album from "@/views/Album.vue";
import Search from "@/views/Search.vue";
import Offline from "@/views/Offline.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Landing,
    },
    {
      path: "/artist/:id",
      name: "Artist",
      component: Artist,
    },
    {
      path: "/album/:id",
      name: "album",
      component: Album,
    },
    {
      path: "/search/",
      name: "Search",
      component: Search,
    },
    {
      path: "/offline",
      name: "Offline",
      component: Offline,
    },
    // {
    //   path: "/",
    //   name: "home",
    //   component: ,
    // },
  ],
});

export default router;
