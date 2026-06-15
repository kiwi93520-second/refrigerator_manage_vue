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

<style scoped></style>
