import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY, isLanguage, type Language } from '../i18n'

/** Restores the saved language once the app is hydrated. */
export function useSavedLanguage() {
  const { i18n } = useTranslation()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (isLanguage(saved) && saved !== i18n.resolvedLanguage) void i18n.changeLanguage(saved)
    } catch {
      // Storage unavailable: keep the default language.
    }
  }, [i18n])
}

export function useLanguage() {
  const { i18n } = useTranslation()

  const setLanguage = useCallback(
    (lng: Language) => {
      void i18n.changeLanguage(lng)
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lng)
      } catch {
        // Storage unavailable: the language still applies for this visit.
      }
    },
    [i18n],
  )

  return { language: i18n.resolvedLanguage, setLanguage }
}
