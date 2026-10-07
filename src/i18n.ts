import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import te from "./locales/te.json";

/** To add a language: create src/locales/<code>.json and add one entry here. */
export const LANGUAGES = [
  { code: "te", label: "తెలుగు", resource: te },
  { code: "en", label: "English", resource: en },
] as const;

export const DEFAULT_LANGUAGE = "te";
export const LANG_STORAGE_KEY = "temple-lang";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: Object.fromEntries(LANGUAGES.map((l) => [l.code, { translation: l.resource }])),
    lng: DEFAULT_LANGUAGE,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    initAsync: false,
  });
}

export default i18n;
