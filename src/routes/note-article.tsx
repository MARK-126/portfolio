import { data, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { getArticle } from '../content/notes.server'
import { slugFromRequest } from '../content/slug.server'
import { Article } from '../components/notes/Article'
import { pageMeta } from '../config/meta'

// Shared by one static route per article (see src/routes.ts), so it uses React Router's generic
// types and reads the slug from the URL instead of a route param.

// Runs at build time.
export function loader({ request }: LoaderFunctionArgs) {
  const article = getArticle(slugFromRequest(request))
  if (!article) throw data('Note not found', { status: 404 })
  return { article }
}

export const meta: MetaFunction<typeof loader> = ({ loaderData, location }) =>
  loaderData
    ? pageMeta({
        path: location.pathname,
        title: loaderData.article.title,
        description: loaderData.article.summary,
        type: 'article',
        publishedTime: loaderData.article.date,
      })
    : pageMeta({ title: 'No encontrada', description: 'Esta nota no existe.' })

export default function NoteArticle() {
  const { article } = useLoaderData<typeof loader>()
  return <Article article={article} />
}
