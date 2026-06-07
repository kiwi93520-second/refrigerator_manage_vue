import { ref } from "vue";

export function useFoodValidation() {
  const errors = ref({
    name: "",
    delayday: "",
    quantity: "",
  });

  function validateFood(food) {
    errors.value.name = "";
    errors.value.delayday = "";
    errors.value.quantity = "";

    let isValid = true;

    if (!food.name || !food.name.trim()) {
      errors.value.name = "食物名稱不能為空";
      isValid = false;
    } else if (food.name.length > 20) {
      errors.value.name = "名稱好像太長了（限制 20 字）";
      isValid = false;
    }

    if (
      food.delayday === undefined ||
      food.delayday === null ||
      food.delayday === ""
    ) {
      food.delayday = 0;
    }

    if (isNaN(Number(food.delayday))) {
      errors.value.delayday = "請輸入正確的數字";
      isValid = false;
    } else if (Number(food.delayday) < 0) {
      errors.value.delayday = "天數不能為負數";
      isValid = false;
    }

    if (
      food.quantity === undefined ||
      food.quantity === null ||
      food.quantity === ""
    ) {
      errors.value.quantity = "數量不能為空";
      isValid = false;
    } else if (isNaN(Number(food.quantity))) {
      errors.value.quantity = "請輸入正確的數字";
      isValid = false;
    } else if (Number(food.quantity) < 0) {
      errors.value.quantity = "數量不能為負數";
      isValid = false;
    }
    return isValid;
  }

  return {
    errors,
    validateFood,
  };
}
