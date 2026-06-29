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
const isPasswordFocused = ref(false);

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
  <h2 class="centerplace">冰箱管理系統 - 會員登入</h2>
  <div class="login-container">
    <div class="refrigerator-container">
      <svg
        viewBox="-10 0 200 240"
        width="160"
        height="192"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="20"
          y="20"
          width="140"
          height="175"
          rx="20"
          fill="#edf2f2"
          stroke="#594a2d"
          stroke-width="4"
        />

        <line
          x1="20"
          y1="80"
          x2="160"
          y2="80"
          stroke="#594a2d"
          stroke-width="4"
        />

        <rect x="150" y="90" width="10" height="60" rx="5" fill="#594a2d" />

        <rect
          x="40"
          y="100"
          width="30"
          height="40"
          rx="5"
          fill="#d9edfc"
          stroke="#9ca3af"
          stroke-width="2"
        />

        <g class="eyes-layer">
          <g v-if="!isPasswordFocused" class="eyes-open">
            <circle
              cx="58"
              cy="55"
              r="12"
              fill="white"
              stroke="#594a2d"
              stroke-width="2"
            />
            <circle cx="58" cy="55" r="5" fill="#594a2d" />
            <circle
              cx="125"
              cy="55"
              r="12"
              fill="white"
              stroke="#594a2d"
              stroke-width="2"
            />
            <circle cx="125" cy="55" r="5" fill="#594a2d" />
          </g>

          <g v-else class="eyes-closed">
            <path
              d="M 48 50 Q 58 60 68 50"
              fill="none"
              stroke="#594a2d"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M 115 50 Q 125 60 135 50"
              fill="none"
              stroke="#594a2d"
              stroke-width="4"
              stroke-linecap="round"
            />
          </g>
        </g>

        <ellipse cx="53" cy="70" rx="8" ry="4" fill="#FFC0CB" opacity="0.7" />
        <ellipse cx="130" cy="70" rx="8" ry="4" fill="#FFC0CB" opacity="0.7" />
      </svg>
    </div>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="請輸入 Email" required />
      <input
        v-model="password"
        type="password"
        @focus="isPasswordFocused = true"
        @blur="isPasswordFocused = false"
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
.centerplace {
  margin: 50px auto;
}
</style>
