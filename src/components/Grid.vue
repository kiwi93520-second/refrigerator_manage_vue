<script setup>
import { computed, onMounted, unref } from "vue";
import { useIngredients } from "../utils/index.js";

const { groupedIngredients, fetchIngredients } = useIngredients();

const statusOrder = ["Expired", "Soon to expire", "Fresh"];

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
        >
          {{ item.name }}
        </button>
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
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 16px;
}
</style>
