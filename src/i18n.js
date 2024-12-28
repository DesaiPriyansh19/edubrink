// src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../src/locales/en.json";
import ar from "../src/locales/ar.json"; // For Spanish language (example)

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },

    fallbackLng: "en", // Default language if the detected language is not available
    interpolation: {
      escapeValue: false, // React already escapes variables
    },
  });

export default i18n;
