<script setup>
import Welcome from "./components/pages/Welcome.vue";
import Dashboard from "./components/pages/Dashboard.vue";
import Layout from "./components/layouts/Layout.vue";
import FoodEdit from "./components/pages/FoodEdit.vue";

const selectedDisplay = 3;
</script>

<template>
  <Layout>
    <Welcome v-if="selectedDisplay == 1" />
    <Dashboard v-if="selectedDisplay == 2" />
    <FoodEdit v-if="selectedDisplay == 3" />
  </Layout>
</template>

<style scoped></style>
