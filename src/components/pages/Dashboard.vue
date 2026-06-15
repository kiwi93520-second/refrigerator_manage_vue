<script setup>
import Grid from '../Grid.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../utils/supabase.js';
import { useIngredients } from '../../utils/index.js';

const router = useRouter();
const userEmail = ref('');
const { Ingredients, fetchIngredients } = useIngredients();

onMounted(async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('獲取使用者失敗:', error.message);
    return;
  }

  if (session && session.user) {
    userEmail.value = session.user.email;

    console.log('當前使用者 UID:', session.user.id);
  }
});

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert('登出失敗：' + error.message);
  } else {
    alert('已成功登出！');

    router.push('/login');
  }
};

const onDataChanged = async (deletedId) => {
  if (deletedId && typeof deletedId !== 'object') {
    if (Ingredients.value) {
      Ingredients.value = Ingredients.value.filter(
        (item) => item.id !== deletedId,
      );
    }
  } else {
    await fetchIngredients(true);
  }
};
</script>

<template>
  <header class="user-header" v-if="userEmail">
    <span
      >目前登入：<strong>{{ userEmail }}</strong> 的冰箱</span
    >
    <button @click="handleLogout" class="logout-btn">登出系統</button>
  </header>
  <button>Food manage &rarr;</button>
  <Grid :ingredients="Ingredients" @refresh="onDataChanged" />
</template>

<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.logout-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #cc0000;
}
</style>
