import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./../messages/en.json";
import vi from "./../messages/vi.json";
import ko from "./../messages/ko.json";
import fr from "./../messages/fr.json";
import jp from "./../messages/jp.json";
import cn from "./../messages/cn.json";

// Get saved language from localStorage or use default
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem("i18nextLng");
    if (saved && ["en", "vi", "ko", "fr", "jp", "cn"].includes(saved)) {
      return saved;
    }
  } catch (e) {
    console.error("Failed to get saved language:", e);
  }
  return "vi";
};

const savedLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
    ko: { translation: ko },
    fr: { translation: fr },
    jp: { translation: jp },
    cn: { translation: cn },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Save language to localStorage when it changes
i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("i18nextLng", lng);
  } catch (e) {
    console.error("Failed to save language:", e);
  }
});

export default i18n;
