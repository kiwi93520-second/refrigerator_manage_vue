<script setup>
import { ref, watch } from 'vue';
import { supabase } from '../../utils/supabase.js';
import { useFoodValidation } from '../../utils/vaildinput.js';
import { useIngredients } from '../../utils/index.js';
import { Notyf } from 'notyf';
const notyf = new Notyf({ position: { x: 'center', y: 'top' } });

const props = defineProps(['food']);
const emit = defineEmits(['close', 'refresh']);
const localFood = ref({ ...props.food, delayday: props.food.delayday ?? 0 });
const loading = ref(false);
const { errors, validateFood } = useFoodValidation();
const { fetchIngredients } = useIngredients();

watch(
  () => localFood.value,
  (newFood) => {
    validateFood(newFood);
  },
  { deep: true },
);
const extendDate = (originalDate, days = 0) => {
  const date = new Date(originalDate);
  date.setDate(date.getDate() + parseInt(days));
  return date.toISOString().split('T')[0]; // 格式化為 YYYY-MM-DD
};

const handleUpdate = async () => {
  try {
    if (!validateFood(localFood.value)) {
      notyf.error('欄位驗證未通過，請檢查紅字標示！');
      return;
    }

    loading.value = true;
    const newExpireDate = extendDate(
      localFood.value.expire_date,
      localFood.value.delayday,
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      notyf.error('登入資訊已過期，請重新登入！');
      return;
    }

    const { error } = await supabase
      .from('ingredients')
      .update({
        name: localFood.value.name,
        quantity: localFood.value.quantity,
        expire_date: newExpireDate,
      })
      .eq('id', localFood.value.id)
      .eq('user_id', session.user.id);
    if (error) throw error;
    notyf.success('更新成功！');
    emit('refresh');
    emit('close');
  } catch (err) {
    notyf.error('程式執行失敗，錯誤原因: ' + (err.message || err));
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('確定刪除？')) return;

  loading.value = true;
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', localFood.value.id);

  if (!error) {
    emit('refresh', localFood.value.id);
  } else {
    notyf.error('刪除失敗');
  }
  loading.value = false;
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>編輯食材</h3>

      <div class="form-group">
        <label>食材名稱</label>
        <input v-model="localFood.name" type="text" />
        <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
      </div>

      <label>有效期限:{{ localFood.expire_date }}</label>

      <div class="form-group">
        <label>延長天數</label>
        <input v-model.number="localFood.delayday" type="number" />
        <span v-if="errors.delayday" class="text-red-500">{{
          errors.delayday
        }}</span>
      </div>

      <div class="form-group">
        <label>剩餘數量</label>
        <input v-model.number="localFood.quantity" type="number" />
        <span v-if="errors.quantity" class="text-red-500">{{
          errors.quantity
        }}</span>
      </div>

      <div class="actions">
        <button
          class="save-btn"
          @click="handleUpdate"
          :disabled="loading"
          @refresh="$emit('refresh')"
        >
          {{ loading ? '更新中...' : '儲存修改' }}
        </button>
        <button class="delete-btn" @click="handleDelete" :disabled="loading">
          刪除食材
        </button>
        <button class="cancel-btn" @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滿屏遮罩層 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* 半透明黑背景 */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 彈窗主體 */
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  width: 85%;
  max-width: 350px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  color: #333;
  text-align: center;
  font-size: 1.2rem;
}

/* 輸入框樣式 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #a6f780;
}

/* 按鈕容器 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

button {
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
}

button:active {
  transform: scale(0.98);
}

/* 不同按鈕的顏色 */
.save-btn {
  background-color: #a6f780;
  color: #2c5a1d;
}

.delete-btn {
  background-color: #f3827e;
  color: white;
}

.cancel-btn {
  background-color: #eee;
  color: #666;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.text-red-500 {
  color: rgba(244, 19, 19, 0.775);
}
</style>
