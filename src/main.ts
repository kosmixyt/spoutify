import "./main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as Bi from "oh-vue-icons/icons/bi";

addIcons(...Object.values({ ...FaIcons }));
addIcons(...Object.values({ ...Bi }));
const app = createApp(App);

app.use(router);
app.component("v-icon", OhVueIcon);
app.mount("#app");
