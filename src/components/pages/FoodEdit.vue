<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useIngredients } from '../../utils/index.js';
import { useVoiceToText } from '../../utils/voiceToText.js';
import { supabase } from '../../utils/supabase.js';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const { ingredients, fetchIngredients, addIngredient } = useIngredients();
const { toggleListen, isListening, resultPreview } = useVoiceToText();
const notyf = new Notyf({ position: { x: 'center', y: 'top' } });
const isSubmitting = ref(false);
const errorMsg = ref('');
const router = useRouter();

const confirmAdd = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  errorMsg.value = '';
  try {
    const result = await addIngredient(resultPreview);

    if (result.success) {
      notyf.success('成功新增!');
      resultPreview.name = '';
      resultPreview.quantity = '';
      resultPreview.location = '';
      router.push('/dashboard');
    } else {
      alert('新增失敗，請檢查網路或資料庫設定');
      console.error(result.error);
    }
  } catch (err) {
    notyf.error(err);
  }
};

onMounted(() => {
  fetchIngredients();
});
</script>

<template>
  <section class="add-food">
    <button @click="toggleListen" :class="{ 'btn-active': isListening }">
      {{ isListening ? '正在聽...' : '按我說話' }}
    </button>
    <h3>注意事項:</h3>
    <p>1.只辨識中文</p>
    <p>2.順序:食材名字->數量->位置(冷藏or冷凍)</p>
    <p>3.ex:巧克力蛋糕一千個冷藏</p>

    <div v-if="resultPreview.name" class="preview-card">
      <h3>辨識結果：</h3>
      <p>食物：<input v-model="resultPreview.name" /></p>
      <p>數量：<input v-model="resultPreview.quantity" /></p>
      <p>
        位置：
        <input v-model="resultPreview.location" />
      </p>
      <button @click="confirmAdd" :disabled="isSubmitting">
        {{ isSubmitting ? '儲存中...' : '確認新增' }}
      </button>
    </div>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </section>
</template>

<style scoped>
button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: #e2e8f0;
}

.btn-active {
  background: #3b82f6 !important;
  color: #ffffff !important;
  border-color: #2563eb !important;
}

h3 {
  font-size: 1rem;
  color: #1e293b;
  margin: 15px 0 8px 0;
}

.add-food p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 5px 0;
}

.preview-card {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

/* 預覽區塊裡面的輸入框 */
.preview-card p {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.preview-card input {
  flex: 1;
  margin-left: 10px;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
}

.preview-card input:focus {
  border-color: #3b82f6;
}

.preview-card button {
  background: #1e293b;
  color: white;
  border: none;
  margin-top: 5px;
}

.preview-card button:hover {
  background: #0f172a;
}

/* 5. 錯誤訊息 */
.error {
  color: #ef4444 !important;
  text-align: center;
  font-weight: bold;
}
</style>
