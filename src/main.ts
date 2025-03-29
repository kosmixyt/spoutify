import "vue3-toastify/dist/index.css";
import "./main.css";

// Vue core
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Icons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as Bi from "oh-vue-icons/icons/bi";

// Components
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer.vue";

// Utils and plugins
import { getToken } from "./api";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";

addIcons(...Object.values({ ...FaIcons }));
addIcons(...Object.values({ ...Bi }));
const app = createApp(App);

getToken().then((token) => {
  console.log("Token:", token);
  app.use(router);
  app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions);
  app.component("v-icon", OhVueIcon);
  app.component("GlobalAudioPlayer", GlobalAudioPlayer);
  app.mount("#app");
});
