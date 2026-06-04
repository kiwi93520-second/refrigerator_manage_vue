<script setup>
import { onMounted, ref, reactive } from "vue";
import { useIngredients } from "../../utils/index.js";
import { useVoiceToText } from "../../utils/voiceToText.js";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

const { ingredients, fetchIngredients, addIngredient } = useIngredients();
const { toggleListen, isListening, resultPreview } = useVoiceToText();
const notyf = new Notyf({position:{x:'center',y:'top'}}	);

const confirmAdd = async () => {
  // 呼叫 index.js 裡的 addIngredient
  const result = await addIngredient(resultPreview);

  if (result.success) {
    notyf.success('成功新增!');
    resultPreview.name = "";
    resultPreview.quantity = "";
    resultPreview.location = "";
  } else {
    alert("新增失敗，請檢查網路或資料庫設定");
    console.error(result.error);
  }
};
onMounted(() => {
  fetchIngredients();
});
</script>

<template>
  <section class="add-food">
    <button @click="toggleListen" :class="{ 'btn-active': isListening }">
      {{ isListening ? "正在聽..." : "按我說話" }}
    </button>

    <div v-if="resultPreview.name" class="preview-card">
      <h3>辨識結果：</h3>
      <p>食物：<input v-model="resultPreview.name" /></p>
      <p>數量：<input v-model="resultPreview.quantity" /></p>
      <p>
        位置：
        <input v-model="resultPreview.location"></input>
      </p>
      <button @click="confirmAdd">確認新增</button>
    </div>
  </section>

</template>

<style scoped></style>
