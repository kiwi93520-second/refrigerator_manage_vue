<script setup>
import { computed, onMounted, ref, unref } from "vue";
import { useIngredients } from "../utils/index.js";
import EditModal from "./pages/EditModel.vue";

const { groupedIngredients, fetchIngredients } = useIngredients();
const statusOrder = ["Expired", "Soon to expire", "Fresh"];
const isModalOpen = ref(false);
const selectedFood = ref(null);
const openEdit = (item) => {
  selectedFood.value = item;
  isModalOpen.value = true;
};

const onDataChanged = async () => {
  console.log("接收到刷新請求，正在重新拉取資料...");
  isModalOpen.value = false;
  await fetchIngredients();
};

onMounted(() => fetchIngredients());
</script>

<template>
  <section id="grid">
    <div v-for="status in statusOrder" :key="status">
      <h2>{{ status }}</h2>

      <div class="container" v-if="groupedIngredients">
        <button
          class="card plan-card"
          v-for="item in groupedIngredients[status]"
          :key="item.id"
          :class="status"
          @click="openEdit(item)"
        >
          {{ item.name }}
        </button>

        <EditModal
          v-if="isModalOpen"
          :food="selectedFood"
          @close="isModalOpen = false"
          @refresh="onDataChanged"
        />
      </div>

      <p v-else-if="groupedIngredients">此類別目前沒有食材</p>
    </div>
  </section>
</template>

<style scoped>
.Expired {
  background: #f3827e;
}

.Soon {
  background: #ffc37e;
}

.Fresh {
  background: #a6f780;
}
#grid {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 11px;
}
.card {
  aspect-ratio: 1 / 1; /* 變成正方形，或是設 fixed height 如 height: 80px; */

  /* 文字處理：防止長文字撐開卡片 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  word-break: break-all;
  padding: 8px;

  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s;
}

.card:active {
  transform: scale(0.95);
}
</style>
