import { ref, onMounted, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '../components/pages/Welcome.vue';
import Dashboard from '../components/pages/Dashboard.vue';
import FoodEdit from '../components/pages/FoodEdit.vue';
import Login from '../components/pages/Login.vue';
import { getCurrentUser } from '../utils/supabase.js';

export const StorageCategories = {
  refrigerated: 'Refrigerated',
  frozen: 'Frozen',
};
export const StatusCategories = {
  expired: 'Expired',
  soon: 'Soon to expire',
  fresh: 'Fresh',
};

function getMyDate(dat = Date.now()) {
  const date = new Date(dat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const Ingredients = ref([]);
const isLoaded = ref(false);
export function useIngredients() {
  // catch data from supabase
  const fetchIngredients = async (forceRefresh = false) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert('請先登入！');
        return;
      }

      if (isLoaded.value && !forceRefresh) return;
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('錯誤:', error);
      } else {
        Ingredients.value = data;
        isLoaded.value = true;
      }
    } catch (err) {
      console.error('😥😥😥error:', err);
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

      let status = 'Fresh';
      if (diffDays < 0) status = 'Expired';
      else if (diffDays <= 3) status = 'Soon to expire';

      return { ...item, dynamicStatus: status };
    });

    return processed.reduce(
      (acc, item) => {
        const key = item.dynamicStatus;
        if (acc[key]) acc[key].push(item);
        return acc;
      },
      { Expired: [], 'Soon to expire': [], Fresh: [] },
    );
  });

  const addIngredient = async (name) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert('請先登入！');
      return;
    }
    const newItem = {
      name: name.name,
      store_date: new Date().toISOString().split('T')[0],
      expire_date: new Date(Date.now() + 3 * 86400000)
        .toISOString()
        .split('T')[0],
      storage: name.location,
      quantity: name.quantity,
      user_id: session.user.id,
    };

    const { data, error } = await supabase
      .from('ingredients')
      .insert([newItem])
      .select();

    if (!error && data) {
      Ingredients.value.push(data[0]);
      return { success: true, data: data };
    } else {
      return { success: false, error };
    }
  };

  return {
    Ingredients,
    groupedIngredients,
    fetchIngredients,
    isLoaded,
    addIngredient,
  };
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },

    {
      path: '/welcome',
      component: Welcome,
    },
    {
      path: '/login',
      component: Login,
      meta: { requiresGuest: true, hideNavbar: true },
    },

    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/foodedit',
      component: FoodEdit,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  console.log(
    `[路由守衛] 前往: ${to.path} | 需要登入: ${requiresAuth} | 已登入: ${isLoggedIn}`,
  );

  if (requiresAuth && !isLoggedIn) {
    return '/login';
  }

  if (requiresGuest && isLoggedIn) {
    return '/dashboard';
  }
});
// router.beforeEach(async (to, from) => {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   const isLoggedIn = !!session;

//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

//   console.log(
//     `去往: ${to.path}, 需要登入: ${requiresAuth}, 已登入: ${isLoggedIn}`,
//   );

//   if (requiresAuth && !isLoggedIn) {
//     return "/login";
//   }

//   if (requiresGuest && isLoggedIn) {
//     return "/dashboard";
//   }
// });

// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     { path: "/", redirect: "/dashboard" },

//     { path: "/Welcome", component: Welcome },
//     { path: "/Dashboard", component: Dashboard },
//     { path: "/FoodEdit", component: FoodEdit },
//   ],
// });

export default router;
