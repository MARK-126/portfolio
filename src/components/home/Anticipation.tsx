import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { reveal } from '../motion/reveal'
import './Anticipation.css'

type Row = { user: string; method: string; amount: string }

// Example rows of the captured table (fictional, as the section label says)
const rows: Row[] = [
  { user: 'a17', method: 'card', amount: '1200.50' },
  { user: 'b02', method: 'transfer', amount: '830.00' },
  { user: 'c41', method: 'transfer', amount: '412.90' },
]

/**
 * The work, shown instead of described: a data contract written before the first event exists,
 * the table that arrives clean because it already had a shape, and the answer to the question
 * the contract asked.
 */
export function Anticipation() {
  const { t } = useTranslation()
  const k = (key: string) => t(`home.anticipation.${key}`)

  // The contract as [key, value, is a field]: top-level keys are translated, field names are code
  const contract: [string, string, boolean][] = [
    ['event', 'checkout_completed', false],
    ['when', k('anticipate.whenValue'), false],
    ['fields', '', false],
    ['user_id', k('anticipate.userId'), true],
    ['amount', k('anticipate.amount'), true],
    ['payment_method', 'card | transfer | cash', true],
    ['ts', k('anticipate.ts'), true],
    ['question', k('anticipate.questionValue'), false],
  ]

  return (
    <section className="anticipation panel" aria-labelledby="anticipation-title">
      <header className="anticipation__head">
        <h2 className="anticipation__title" id="anticipation-title">
          {k('title')}
        </h2>
        <p className="anticipation__label">{k('label')}</p>
      </header>

      <div className="anticipation__stages">
        <m.article className="anticipation__stage anticipation__stage--future" {...reveal()}>
          <p className="anticipation__stage-top">
            <span>01 · {k('anticipate.step')}</span>
            <span>{k('anticipate.file')}</span>
          </p>
          <pre className="anticipation__code">
            {contract.map(([key, value, indent]) => (
              <span
                key={key}
                className={indent ? 'anticipation__line anticipation__line--field' : 'anticipation__line'}
              >
                {indent ? `${key}: ` : <b>{k(`anticipate.${key}`)}: </b>}
                {value}
              </span>
            ))}
          </pre>
          <p className="anticipation__note">{k('anticipate.note')}</p>
        </m.article>

        <m.article className="anticipation__stage" {...reveal(0.1)}>
          <p className="anticipation__stage-top">
            <span>02 · {k('capture.step')}</span>
            <span>fct_checkout</span>
          </p>
          <div className="anticipation__table">
            <table>
              <thead>
                <tr>
                  <th>{k('capture.user')}</th>
                  <th>{k('capture.method')}</th>
                  <th className="anticipation__num">{k('capture.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.user}>
                    <td>{row.user}</td>
                    <td>{row.method}</td>
                    <td className="anticipation__num">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="anticipation__note">{k('capture.note')}</p>
        </m.article>

        <m.article className="anticipation__stage anticipation__stage--useful" {...reveal(0.2)}>
          <p className="anticipation__stage-top">
            <span>03 · {k('process.step')}</span>
            <span>{k('process.file')}</span>
          </p>
          <p className="anticipation__insight">
            {k('process.before')} <mark>{k('process.mark')}</mark> {k('process.after')}
          </p>
          <p className="anticipation__note">{k('process.note')}</p>
        </m.article>
      </div>
    </section>
  )
}
