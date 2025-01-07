import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Artist from "@/views/Artist.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Landing,
    },
    {
      path: "/artist",
      name: "Artist",
      component: Artist,
    },
    // {
    //   path: "/",
    //   name: "home",
    //   component: ,
    // },
  ],
});

export default router;
