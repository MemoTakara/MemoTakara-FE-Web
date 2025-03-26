import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import vi from "@/locales/vi.json";
import zh from "@/locales/zh.json";

i18n
  .use(LanguageDetector) // Phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      vi: { translation: vi },
      zh: { translation: zh },
    },
    fallbackLng: "en", // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false, // Cho phép hiển thị HTML nếu cần
    },
  });

export default i18n;
