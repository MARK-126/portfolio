import { data, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { getProject } from '../content/projects.server'
import { slugFromRequest } from '../content/slug.server'
import { CaseStudy } from '../components/projects/CaseStudy'
import { pageMeta } from '../config/meta'

// Shared by one static route per project (see src/routes.ts), so it uses React Router's generic
// types and reads the slug from the URL instead of a route param.

// Runs at build time.
export function loader({ request }: LoaderFunctionArgs) {
  const project = getProject(slugFromRequest(request))
  if (!project) throw data('Project not found', { status: 404 })
  return { project }
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) =>
  loaderData
    ? pageMeta({ title: loaderData.project.title, description: loaderData.project.summary })
    : pageMeta({ title: 'Not found', description: 'This project does not exist.' })

export default function Project() {
  const { project } = useLoaderData<typeof loader>()
  return <CaseStudy project={project} />
}
