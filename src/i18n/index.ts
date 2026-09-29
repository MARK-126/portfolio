import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

export const languages = ['en', 'es'] as const
export type Language = (typeof languages)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, es: { translation: es } },
    supportedLngs: languages,
    fallbackLng: 'en',
    // English by default; only a language the visitor picked explicitly overrides it.
    detection: { order: ['localStorage'], lookupLocalStorage: 'lang', caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', lng => {
  document.documentElement.lang = lng
})

export default i18n
