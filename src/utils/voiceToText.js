import { onMounted, ref, reactive } from "vue";
import { StorageCategories } from "./index.js";

export function useVoiceToText() {
  const isListening = ref(false);
  const resultPreview = reactive({
    name: "",
    quantity: 1,
    location: "冷藏",
  });
  // call speechrecongnition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("您的瀏覽器不支援語音辨識，建議使用 Chrome");
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "zh-TW";
  recognition.continuous = false;

  // translate
  function parseVoiceCommand(text) {
    const locations = ["冷藏", "冷凍", "櫥櫃"];

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
  }

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("聽到的是:", transcript);

    const parsed = parseVoiceCommand(transcript);
    parsed.quantity = textToNumber(parsed.quantity);
    parsed.location = getEnglishCategory(parsed.location);
    console.log(parsed);

    if (isNaN(parsed.quantity)) {
      console.log("無法辨識為有效數字，請重新說一次。");
    } else {
      console.log("轉換後的數字:", parsed.quantity);
    }

    Object.assign(resultPreview, parsed);
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  const toggleListen = () => {
    if (!recognition) return alert("不支援語音");
    isListening.value ? recognition.stop() : recognition.start();
  };

  function getEnglishCategory(chineseName) {
    const mapping = {
      冷藏: StorageCategories.refrigerated,
      冷凍: StorageCategories.frozen,
      櫥櫃: StorageCategories.cabinet,
    };

    return mapping[chineseName] || "Unknown";
  }
  function textToNumber(text) {
    const chineseMap = {
      零: 0,
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
    };
    const unitMap = { 十: 10, 百: 100, 千: 1000, 萬: 10000 };

    let cleanStr = text
      .replace(/[\s,]/g, "")
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248));

    let normalizedStr = cleanStr
      .split("")
      .map((char) => (chineseMap[char] !== undefined ? chineseMap[char] : char))
      .join("");

    let total = 0;
    let section = 0;
    let tempNum = 0;
    let lastUnit = 1;
    for (let i = 0; i < normalizedStr.length; i++) {
      const char = normalizedStr[i];
      const unitValue = unitMap[char];

      if (unitValue !== undefined) {
        let num = tempNum === 0 && char === "十" ? 1 : tempNum;

        if (unitValue >= 10000) {
          section = (section + (num || 1)) * unitValue;
          total += section;
          section = 0;
        } else {
          section += (num || 1) * unitValue;
        }
        tempNum = 0;
        lastUnit = unitValue;
      } else {
        const val = parseInt(char, 10);
        if (isNaN(val)) continue;

        tempNum = tempNum * 10 + val;
      }
    }

    if (tempNum > 0) {
      section += tempNum;
    }

    return total + section;
  }

  return {
    isListening,
    resultPreview,
    toggleListen,
    resultPreview,
  };
}
