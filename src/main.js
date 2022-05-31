import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
createApp(App).use(router).use(Vue3Lottie).use(VueLodash).use(lodash).mount("#app");