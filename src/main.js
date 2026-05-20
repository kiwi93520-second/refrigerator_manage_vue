import { createApp } from "vue";
import "./utils/main.css";
import App from "./App.vue";
import router from "./utils/index.js";

const app = createApp(App);
app.use(router);
app.mount("#app");
