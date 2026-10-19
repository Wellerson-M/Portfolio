'use client'

import type { ReactNode } from 'react'
import Carousel from '@/components/ui/Carousel'
import LiveFrame from '@/components/ui/LiveFrame'
import useMediaQuery from '@/components/ui/useMediaQuery'
import type { Project } from '@/lib/projects'

/**
 * Quando o projeto está no ar, o site rodando vem primeiro e os prints logo
 * abaixo. O notebook reduzido numa tela de celular fica ilegível, então ali a
 * demo vira um link para abrir o site.
 */
export default function ProjectMedia({ project }: { project: Project }) {
  const wide = useMediaQuery('(min-width: 768px)')
  const demo = project.demo
  const inline = demo && (demo.device === 'phone' || wide)

  return (
    <div>
      {demo && inline && (
        <div className="mb-20">
          <Label>teste aqui mesmo</Label>
          <LiveFrame {...demo} title={project.name} />
        </div>
      )}

      {demo && !inline && (
        <div className="mb-10 flex justify-center">
          <a
            href={project.live ?? demo.src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-amber-500/60 bg-amber-500/10 px-4 py-2 font-mono text-xs text-amber-200 transition-colors hover:bg-amber-500/20"
          >
            abrir o site para testar &#8599;
          </a>
        </div>
      )}

      {project.shotsNote ? <Label>{project.shotsNote}</Label> : demo && <Label>prints</Label>}
      <Carousel shots={project.shots} shape={project.shotShape} />
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-center font-mono text-xs text-ink-500">{children}</p>
}
