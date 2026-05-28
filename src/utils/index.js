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

export function useIngredients() {
  const Ingredients = ref([]);

  // catch data from supabase
  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase.from("ingredients").select("*");

      if (error) {
        console.error("錯誤:", error);
      } else {
        console.log("--- 原始資料檢查 ---");
        console.table(data); // 這會把資料轉成表格印在 Console，看欄位名是不是 expire_date
        Ingredients.value = data;
      }
    } catch (err) {
      console.error("😥😥😥error:", err);
    }
  };

  //define 快過期天數
  const SOON_TO_EXPIRE = 3;

  //computedS
  const groupedIngredients = computed(() => {
    const items = Ingredients.value || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const processed = items.map((item) => {
      // ⚠️ 注意：Supabase 回傳的是下底線 expire_date
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

  // onMounted(fetchIngredients);

  return { Ingredients, groupedIngredients, fetchIngredients };
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
