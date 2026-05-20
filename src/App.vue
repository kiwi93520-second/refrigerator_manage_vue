<script setup>
// import Welcome from "./components/pages/Welcome.vue";
// import Dashboard from "./components/pages/Dashboard.vue";
import Layout from "./components/layouts/Layout.vue";
// import FoodEdit from "./components/pages/FoodEdit.vue";
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <Layout>
    <RouterLink to="/Welcome">welcome</RouterLink>
    <RouterLink to="/Dashboard">Dashboard</RouterLink>
    <RouterLink to="/FoodEdit">Foodedit</RouterLink>
    <RouterView></RouterView>
  </Layout>
</template>

<style scoped></style>
