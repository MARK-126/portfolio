import { useTranslation } from 'react-i18next'
import './LangBadge.css'

/** Small "ES" / "EN" tag, shown only when content is in a different language than the UI. */
export function LangBadge({ lang }: { lang: string }) {
  const { t, i18n } = useTranslation()
  if (lang === i18n.resolvedLanguage) return null

  return (
    <abbr className="lang-badge" title={t('note.writtenIn', { lang: t(`language.names.${lang}`, lang) })}>
      {lang}
    </abbr>
  )
}
