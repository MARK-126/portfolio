import { useTranslation } from 'react-i18next'
import type { Section } from '../config/sections'
import { PageIntro } from './PageIntro'

/** Temporary page body until each section is built in its own branch. */
export function SectionPlaceholder({ section }: { section: Section }) {
  const { t } = useTranslation()

  return (
    <PageIntro tag={t(`pages.${section}.tag`)} title={t(`pages.${section}.title`)} intro={t(`pages.${section}.intro`)}>
      <p className="page-intro__soon">
        <span aria-hidden="true">//</span> {t('pages.soon')}
      </p>
    </PageIntro>
  )
}
