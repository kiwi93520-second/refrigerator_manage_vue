<script setup>
import { computed, unref } from "vue";
import { useIngredients } from "../utils/index.js";

const { grouedIngredients } = useIngredients();

const statusOrder = ["Expired", "Soon to expire", "Fresh"];
</script>

<template>
  <section id="grid">
    <div v-for="status in statusOrder" :key="status">
      <h2>{{ status }}</h2>

      <div class="container" v-if="grouedIngredients[status]">
        <button
          class="card plan-card"
          v-for="item in groupedIngredients[status]"
          :key="item.id"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.Expired {
  background: #f3827e;
}

.soon-to-expire {
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
