import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { NoteSummary } from '../../content/types'
import { formatDate } from '../../utils/date'
import { LangBadge } from './LangBadge'
import './NoteList.css'

function NoteRowContent({ note }: { note: NoteSummary }) {
  const { t, i18n } = useTranslation()
  const external = note.type === 'link'

  return (
    <>
      <time className="note-row__date" dateTime={note.date}>
        {formatDate(note.date, i18n.resolvedLanguage)}
      </time>
      <span className="note-row__type">{t(`note.${note.type}`)}</span>
      <span className="note-row__body">
        <span className="note-row__title" lang={note.lang}>
          {note.title}
          <LangBadge lang={note.lang} />
          {external && <span className="visually-hidden"> ({t('note.external')})</span>}
        </span>
        <span className="note-row__summary" lang={note.lang}>
          {note.summary}
        </span>
      </span>
      <span className="note-row__meta">
        {note.source}
        <span aria-hidden="true">{external ? ' ↗' : ' →'}</span>
      </span>
    </>
  )
}

export function NoteList({ notes }: { notes: NoteSummary[] }) {
  return (
    <ol className="note-list">
      {notes.map(note => (
        <li key={note.slug}>
          {/* Articles have their own page; links go straight to the source. */}
          {note.type === 'link' && note.url ? (
            <a href={note.url} className="note-row" target="_blank" rel="noreferrer">
              <NoteRowContent note={note} />
            </a>
          ) : (
            <Link to={`/notes/${note.slug}`} className="note-row">
              <NoteRowContent note={note} />
            </Link>
          )}
        </li>
      ))}
    </ol>
  )
}
