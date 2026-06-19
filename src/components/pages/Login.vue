<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../utils/supabase.js';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const notyf = new Notyf({ position: { x: 'center', y: 'top' } });

const handleLogin = async () => {
  errorMessage.value = '';
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = `登入失敗：${error.message}`;
  } else {
    notyf.success('登入成功！');
    router.push('/dashboard');
  }
};

const handleRegister = async () => {
  errorMessage.value = '';
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = `註框失敗：${error.message}`;
  } else {
    notyf.success('註冊成功並已自動登入！');
    router.push('/dashboard');
  }
};
</script>
<template>
  <div class="login-container">
    <h2>冰箱管理系統 - 會員登入</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="請輸入 Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="請輸入密碼"
        required
      />

      <div class="actions">
        <button type="submit">登入</button>
        <button type="button" @click="handleRegister">快速註冊</button>
      </div>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>
<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
button {
  padding: 8px 15px;
  cursor: pointer;
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
