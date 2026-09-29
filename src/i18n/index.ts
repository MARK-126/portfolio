import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

export const languages = ['en', 'es'] as const
export type Language = (typeof languages)[number]

export const LANGUAGE_STORAGE_KEY = 'lang'

// Pages are prerendered in English. A language the visitor picked is restored
// after hydration (see useSavedLanguage), so server and client HTML match.
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: 'en',
  supportedLngs: languages,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', lng => {
  if (typeof document !== 'undefined') document.documentElement.lang = lng
})

export function isLanguage(value: unknown): value is Language {
  return languages.includes(value as Language)
}

export default i18n
