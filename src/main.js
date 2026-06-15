import { createApp } from "vue";
import "./utils/main.css";
import App from "./App.vue";
import router from "./utils/index.js";
import { supabase } from "./utils/supabase.js";

const app = createApp(App);
app.use(router);
let isAppMounted = false;

supabase.auth.onAuthStateChange(() => {
  if (!isAppMounted) {
    app.mount("#app");
    isAppMounted = true;
    console.log("Supabase 初始化完畢，Vue App 成功掛載！");
  }
});
