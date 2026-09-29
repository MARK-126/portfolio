import { data, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { getProject } from '../content/projects.server'
import { slugFromRequest } from '../content/slug.server'
import type { ProjectSection } from '../content/types'
import { CaseStudy } from '../components/work/CaseStudy'
import { pageMeta } from '../config/meta'

// Shared by one static route per project, for both /work/<slug> and /lab/<slug> (see
// src/routes.ts), so it uses React Router's generic types and reads section and slug from the URL.

// Runs at build time.
export function loader({ request }: LoaderFunctionArgs) {
  const section: ProjectSection = new URL(request.url).pathname.startsWith('/lab/') ? 'lab' : 'work'
  const project = getProject(section, slugFromRequest(request))
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
