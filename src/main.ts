import "./main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as Bi from "oh-vue-icons/icons/bi";
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer.vue';
import { getToken } from "./api";

addIcons(...Object.values({ ...FaIcons }));
addIcons(...Object.values({ ...Bi }));
const app = createApp(App);


getToken().then((token) => {
    console.log("Token:", token);
    app.use(router);
    app.component("v-icon", OhVueIcon);
    app.component('GlobalAudioPlayer', GlobalAudioPlayer);
    app.mount("#app");
})
