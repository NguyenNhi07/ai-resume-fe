import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./../messages/en.json";
import vi from "./../messages/vi.json";
import ko from "./../messages/ko.json";
import fr from "./../messages/fr.json";
import jp from "./../messages/jp.json";
import cn from "./../messages/cn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
    ko: { translation: ko },
    fr: { translation: fr },
    jp: { translation: jp },
    cn: { translation: cn },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
