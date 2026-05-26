<script setup>
// import { Ingredient } from "../../utils";
// const recognition = new (
//   window.SpeechRecognition || window.webkitSpeechRecognition
// )();

// // 設定語言為中文
// recognition.lang = "zh-TW";

// // 設定為連續模式
// recognition.continuous = true;

// // 設定為顯示中間結果
// recognition.interimResults = true;

// // 開始語音識別
// recognition.start();

// // 當結果返回時觸發
// recognition.onresult = function (event) {
//   let finalTranscript = "";
//   let interimTranscript = "";

//   // 解析結果
//   for (let i = event.resultIndex; i < event.results.length; i++) {
//     const result = event.results[i];
//     if (result.isFinal) {
//       finalTranscript += result[0].transcript;
//     } else {
//       interimTranscript += result[0].transcript;
//     }
//   }

//   console.log("即時結果:", interimTranscript);
//   console.log("最終結果:", finalTranscript);
// };

// // 當語音識別結束後處理
// recognition.onend = function () {
//   // 重新啟動識別以保持持續監聽
//   recognition.start();
// };

const parseVoiceCommand = (text) => {
  const locations = ["冷藏", "冷凍", "常溫", "櫥櫃"];

  const qtyMatch = text.match(
    /(\d+|一|二|三|四|五|六|七|八|九|十)\s*(個|瓶|把|支|份|顆)?/,
  );
  const quantity = qtyMatch ? qtyMatch[1] : 1;

  const location = locations.find((loc) => text.includes(loc)) || "冷藏";

  let name = text
    .replace(/(放入|新增|加入|買了)/g, "")
    .replace(location, "")
    .replace(qtyMatch ? qtyMatch[0] : "", "")
    .trim();

  return { name, quantity, location };
};

import { ref, reactive } from "vue";

const isListening = ref(false);
const resultPreview = reactive({ name: "", quantity: 1, location: "冷藏" });

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("您的瀏覽器不支援語音辨識，建議使用 Chrome");
}

const recognition = new SpeechRecognition();
recognition.lang = "zh-TW";
recognition.continuous = false;

recognition.onstart = () => {
  isListening.value = true;
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log("聽到的是:", transcript);

  const parsed = parseVoiceCommand(transcript);

  Object.assign(resultPreview, parsed);
};

recognition.onend = () => {
  isListening.value = false;
};

const toggleListen = () => {
  if (isListening.value) {
    recognition.stop();
  } else {
    recognition.start();
  }
};

const confirmAdd = () => {
  console.log("正式存入資料庫:", resultPreview);
  // 在這裡呼叫你的 API
};

const confirmDelete = (id) => {
  Ingredient.value = Ingredient.value.filter((item) => item.id !== id);
};

const editingId = ref(null);
const editingField = ref("");

const startEdit = (id, field) => {
  editingId.value = id;
  editingField.value = field;
};

const stopEdit = () => {
  editingId.value = null;
  editingField.value = "";
};
</script>

<template>
  <section class="add-food">
    <button @click="toggleListen" :class="{ 'btn-active': isListening }">
      {{ isListening ? "正在聽..." : "按我說話" }}
    </button>

    <div v-if="resultPreview.name" class="preview-card">
      <h3>辨識結果：</h3>
      <p>食物：<input v-model="resultPreview.name" /></p>
      <p>數量：<input v-model="resultPreview.quantity" /></p>
      <p>
        位置：
        <select v-model="resultPreview.location">
          <option>冷藏</option>
          <option>冷凍</option>
          <option>常溫</option>
        </select>
      </p>
      <button @click="confirmAdd">確認新增</button>
    </div>
  </section>

  <!-- show food history & delete food-->
  <!-- <section class="show-food">
    <div v-for="(items, index) in Ingredient" :key="items.index">
      <input
        v-if="editingId === items.id && editingField === 'name'"
        v-model="items.name"
        @blur="stopEdit"
      />
      <h2 v-else @click="startEdit(items.id, 'name')">
        {{ items.name }}
      </h2>

      <input
        v-if="editingId === items.id && editingField === 'storeDate'"
        v-model="items.storeDate"
        @blur="stopEdit"
      />

      <p v-else @click="startEdit(items.id, 'storeDate')">
        {{ items.storeDate }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'expireDate'"
        v-model="items.expireDate"
        @blur="stopEdit"
      />

      <p v-else @click="startEdit(items.id, 'expireDate')">
        {{ items.expireDate }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'storage'"
        v-model="items.storage"
        @blur="stopEdit"
      />
      <p v-else @click="startEdit(items.id, 'storage')">
        {{ items.storage }}
      </p>

      <input
        v-if="editingId === items.id && editingField === 'status'"
        v-model="items.status"
        @blur="stopEdit"
      />
      <p v-else @click="startEdit(items.id, 'status')">
        {{ items.status }}
      </p>

      <p>{{ items.id }}</p>
      <button @click="confirmDelete(items.id)">確認刪除</button>
    </div>
  </section> -->
</template>

<style scoped></style>
