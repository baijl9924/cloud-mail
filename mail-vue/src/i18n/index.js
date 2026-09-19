import { createI18n } from 'vue-i18n';
import en from './en.js'
import zh from './zh.js'
import es from './es.js'
const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages: {
        es,
        en,
        zh
    },
});

export default i18n;