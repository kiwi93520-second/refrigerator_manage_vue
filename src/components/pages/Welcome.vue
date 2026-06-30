<script setup></script>

<template>
  <section id="welcome">
    <div class="benefits">
      <h2>
        Hello,User!<br />
        This app could help you manage your food!
      </h2>
      <p>✅Decrease the waste of food!</p>
      <p>✅Eat the fresh food!</p>
      <p>✅Go GO GO!</p>
    </div>
    <div class="card start">
      <h3>🎉 Let's Go</h3>
      <p>Start to manage your food in refrigerator!</p>
      <p>step1. 點擊導覽列的編輯食材去新增食材</p>
      <p>管理食物:到儀表板點擊想要的食材即可更改</p>
    </div>
  </section>
</template>

<style scoped>
#welcome,
.benefits,
.start {
  display: flex;
  flex-direction: column;
}
#welcome {
  gap: 3rem;
}
.benefits {
  gap: 0.5rem;
}
.benefits h2 {
  line-height: 2.25rem;
}
.start {
  gap: 0.2rem;
}
@media (min-width: 640px) {
  #welcome {
    gap: 2rem;
    padding: 1rem 0;
  }

  .start {
    gap: 1rem;
  }
}
</style>
