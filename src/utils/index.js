import { ref, onMounted, computed } from "vue";
import { supabase } from "../utils/supabase";
import { createRouter, createWebHistory } from "vue-router";
import Welcome from "../components/pages/Welcome.vue";
import Dashboard from "../components/pages/Dashboard.vue";
import FoodEdit from "../components/pages/FoodEdit.vue";

export const StorageCategories = {
  refrigerated: "Refrigerated",
  frozen: "Frozen",
  cabinet: "Cabinet",
};
export const StatusCategories = {
  expired: "Expired",
  soon: "Soon to expire",
  fresh: "Fresh",
};

function getMyDate(dat = Date.now()) {
  const date = new Date(dat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const Ingredients = ref([]);
const isLoaded = ref(false);
export function useIngredients() {
  // catch data from supabase
  const fetchIngredients = async (forceRefresh = false) => {
    try {
      if (isLoaded.value && !forceRefresh) return;
      const { data, error } = await supabase.from("ingredients").select("*");

      if (error) {
        console.error("錯誤:", error);
      } else {
        console.log("--- 原始資料檢查 ---");
        console.table(data);
        Ingredients.value = data;
        isLoaded.value = true;
      }
    } catch (err) {
      console.error("😥😥😥error:", err);
    }
  };

  //computed
  const groupedIngredients = computed(() => {
    const items = Ingredients.value || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const processed = items.map((item) => {
      const expire = new Date(item.expire_date);
      const diffDays = Math.ceil((expire - today) / (1000 * 60 * 60 * 24));

      let status = "Fresh";
      if (diffDays < 0) status = "Expired";
      else if (diffDays <= 3) status = "Soon to expire";

      return { ...item, dynamicStatus: status };
    });

    return processed.reduce(
      (acc, item) => {
        const key = item.dynamicStatus;
        if (acc[key]) acc[key].push(item);
        return acc;
      },
      { Expired: [], "Soon to expire": [], Fresh: [] },
    );
  });

  const addIngredient = async (name) => {
    const newItem = {
      name: name.name,
      store_date: new Date().toISOString().split("T")[0],
      expire_date: new Date(Date.now() + 3 * 86400000)
        .toISOString()
        .split("T")[0],
      storage: name.location,
      quantity: name.quantity,
    };

    const { data, error } = await supabase
      .from("ingredients")
      .insert([newItem])
      .select();

    if (!error && data) {
      // 關鍵：直接更新全域 ref，畫面上所有組件都會瞬間跳出新食材
      Ingredients.value.push(data[0]);
      return { success: true, data: data };
    }
    return { success: false, error };
  };
  // onMounted(fetchIngredients);

  return {
    Ingredients,
    groupedIngredients,
    fetchIngredients,
    isLoaded,
    addIngredient,
  };
}

// onMounted(() => {
//   fetchIngredients();
// });
// export const Ingredient = ref([
//   {
//     id: 1,
//     name: "Eggs",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 2 * 86400000),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.soon,
//   },
//   {
//     id: 2,
//     name: "Eggs",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 2 * 86400000),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.soon,
//   },
//   {
//     id: 3,
//     name: "Eggs",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 2 * 86400000),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.soon,
//   },
//   {
//     id: 4,
//     name: "Eggs",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 2 * 86400000),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.soon,
//   },
//   {
//     id: 5,
//     name: "Eggs",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 2 * 86400000),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.soon,
//   },
//   {
//     id: 6,
//     name: "Eggs2",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 7,
//     name: "Eggs2",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 8,
//     name: "Eggs2",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 9,
//     name: "eeeeee",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 10,
//     name: "Eggs2",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 11,
//     name: "Eggs2",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(Date.now() + 30 * 86400000),
//     storage: StorageCategories.frozen,
//     status: StatusCategories.fresh,
//   },
//   {
//     id: 12,
//     name: "Eggs3",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.expired,
//   },
//   {
//     id: 13,
//     name: "Eggs3",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.expired,
//   },
//   {
//     id: 14,
//     name: "Eggs3",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.expired,
//   },
//   {
//     id: 15,
//     name: "Eggs3",
//     storeDate: getMyDate(),
//     expireDate: getMyDate(),
//     storage: StorageCategories.refrigerated,
//     status: StatusCategories.expired,
//   },
// ]);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" }, // 或 component: Dashboard

    { path: "/Welcome", component: Welcome },
    { path: "/Dashboard", component: Dashboard },
    { path: "/FoodEdit", component: FoodEdit },
  ],
});

export default router;
