import { useTranslation } from 'react-i18next'
import type { NoteSummary } from '../../content/types'
import './NoteList.css'

function formatDate(iso: string, language = 'en') {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(
    date,
  )
}

export function NoteList({ notes }: { notes: NoteSummary[] }) {
  const { t, i18n } = useTranslation()

  return (
    <ol className="note-list">
      {notes.map(note => {
        const external = note.type === 'link' && note.url
        return (
          <li key={note.slug}>
            {/* Articles get their own page in the notes section; links go straight to the source. */}
            <a
              href={external ? note.url : `/notes/${note.slug}`}
              className="note-row"
              {...(external && { target: '_blank', rel: 'noreferrer' })}
            >
              <time className="note-row__date" dateTime={note.date}>
                {formatDate(note.date, i18n.resolvedLanguage)}
              </time>
              <span className="note-row__type">{t(`note.${note.type}`)}</span>
              <span className="note-row__body">
                <span className="note-row__title">
                  {note.title}
                  {external && <span className="visually-hidden"> ({t('note.external')})</span>}
                </span>
                <span className="note-row__summary">{note.summary}</span>
              </span>
              <span className="note-row__meta">
                {note.source}
                <span aria-hidden="true">{external ? ' ↗' : ' →'}</span>
              </span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}
