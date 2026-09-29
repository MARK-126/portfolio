import { useTranslation } from 'react-i18next'
import type { NoteDetail } from '../../content/types'
import { formatDate } from '../../utils/date'
import { Pager } from '../Pager'
import { BackLink } from '../BackLink'
import { LangBadge } from './LangBadge'
import '../Prose.css'
import './Article.css'

export function Article({ article }: { article: NoteDetail }) {
  const { t, i18n } = useTranslation()

  return (
    <article className="article container">
      <header className="article__header">
        <BackLink fallback="/notes" />

        <p className="article__meta">
          <time dateTime={article.date}>{formatDate(article.date, i18n.resolvedLanguage)}</time>
          <span aria-hidden="true">·</span>
          <span>{t('notes.readingTime', { count: article.readingMinutes })}</span>
          <LangBadge lang={article.lang} />
        </p>

        <h1 className="article__title" lang={article.lang}>
          {article.title}
        </h1>
        <p className="article__summary" lang={article.lang}>
          {article.summary}
        </p>

        {article.tags.length > 0 && (
          <ul className="article__tags" aria-label={t('notes.tags')}>
            {article.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </header>

      {/* Body is rendered at build time from Markdown files in this repo (trusted content). */}
      {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
      <div className="article__body prose" lang={article.lang} dangerouslySetInnerHTML={{ __html: article.html }} />

      <Pager
        label={t('notes.more')}
        previous={article.previous && { to: `/notes/${article.previous.slug}`, title: article.previous.title }}
        next={article.next && { to: `/notes/${article.next.slug}`, title: article.next.title }}
      />
    </article>
  )
}
