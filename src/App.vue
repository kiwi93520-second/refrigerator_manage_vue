<template>
  <div class="app-container">
    <nav v-if="!route.meta.hideNavbar" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">🗄️FoodApp</div>
        <div class="nav-links">
          <RouterLink to="/welcome" class="nav-item" active-class="active"
            >新手指南</RouterLink
          >
          <RouterLink to="/dashboard" class="nav-item" active-class="active"
            >儀表板</RouterLink
          >
          <RouterLink to="/foodedit" class="nav-item" active-class="active"
            >編輯食材</RouterLink
          >
        </div>
      </div>
    </nav>

    <main :class="route.meta.hideNavbar ? 'login-layout' : 'main-content'">
      <div :class="route.meta.hideNavbar ? '' : 'content-card'">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #334155;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.navbar {
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px); /* 毛玻璃 */
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4f46e5;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

/* 路由連結樣式 */
.nav-item {
  text-decoration: none;
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #4f46e5;
  background-color: #e0e7ff;
}

/* 作用中的路由樣式 */
.nav-item.active {
  background-color: #e0e7ff;
  color: #4338ca;
  font-weight: 600;
}

/* 一般頁面的外框間距 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.content-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-height: calc(100vh - 12rem);
}

/* 登入頁專用的全螢幕樣式（不加上方的間距） */
.login-layout {
  width: 100%;
  min-height: 100vh;
}
</style>
