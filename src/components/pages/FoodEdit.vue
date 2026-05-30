<script setup>
// import { Ingredient } from "../../utils";
import { onMounted, ref, reactive } from "vue";
import { useIngredients } from "../../utils/index.js";
import {
  toggleListen,
  isListening,
  resultPreview,
  confirmAdd,
} from "../../utils/voiceToText.js";

const { ingredients, fetchIngredients } = useIngredients();

onMounted(() => {
  // 雖然每個頁面都寫這行，但只有第一個進去的頁面會觸發 API
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
        <select v-model="resultPreview.location">
          <option>冷藏</option>
          <option>冷凍</option>
          <option>常溫</option>
        </select>
      </p>
      <button @click="confirmAdd">確認新增</button>
    </div>
  </section>

  <!-- show food history & delete food-->
  <!-- <section class="show-food">
    <div v-for="(items, index) in Ingredient" :key="items.index">
      <input
        v-if="editingId === items.id && editingField === 'name'"
        v-model="items.name"
        @blur="stopEdit"
      />
      <h2 v-else @click="startEdit(items.id, 'name')">
        {{ items.name }}
      </h2>

      <input
        v-if="editingId === items.id && editingField === 'storeDate'"
        v-model="items.storeDate"
        @blur="stopEdit"
      />

      <p v-else @click="startEdit(items.id, 'storeDate')">
        {{ items.storeDate }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'expireDate'"
        v-model="items.expireDate"
        @blur="stopEdit"
      />

      <p v-else @click="startEdit(items.id, 'expireDate')">
        {{ items.expireDate }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'storage'"
        v-model="items.storage"
        @blur="stopEdit"
      />
      <p v-else @click="startEdit(items.id, 'storage')">
        {{ items.storage }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'status'"
        v-model="items.status"
        @blur="stopEdit"
      />
      <p v-else @click="startEdit(items.id, 'status')">
        {{ items.status }}
      </p>

      <p>{{ items.id }}</p>
      <button @click="confirmDelete(items.id)">確認刪除</button>
    </div>
  </section> -->
</template>

<style scoped></style>
