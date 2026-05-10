<script setup>
import { computed } from "vue";
import { Ingredient } from "../utils";

const grouped = computed(() => {
  const sorted = [...Ingredient].sort((a, b) => a.expireDate - b.expireDate);

  return sorted.reduce((acc, item) => {
    const key = item.status;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});
});
</script>

<template>
  <section id="grid">
    <div v-for="(items, group) in grouped" :key="group">
      <h2>{{ group }}</h2>

      <div class="container">
        <button
          v-for="item in items"
          class="card plan-card"
          :class="item.status"
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
