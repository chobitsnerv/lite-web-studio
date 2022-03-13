import { createI18n } from "vue-i18n";
import zh from "i18n/locales/zh.json";
import en from "i18n/locales/en.json";
import mapping from "i18n/locales/map.json";

export const i18n = createI18n({
  locale: mapping[navigator.language],
  messages: {
    zh: zh,
    en: en,
  },
  fallbackLocale: zh,
  fallbackWarn: false,
  missingWarn: false,
  globalInjection: true,
});
