import zh from './locales/zh.json'
import en from './locales/en.json'
import {createI18n} from "vue-i18n";
import mapping from './locales/map.json'

export const i18n = createI18n({
    locale: mapping[navigator.language],
    messages: {
        zh: zh,
        en: en
    },
    fallbackLocale: zh,
    fallbackWarn: false,
    missingWarn: false,
    globalInjection: true
})
