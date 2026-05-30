import { onMounted, ref, reactive } from "vue";

export const isListening = ref(false);
const resultPreview = reactive({ name: "", quantity: 1, location: "冷藏" });

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
