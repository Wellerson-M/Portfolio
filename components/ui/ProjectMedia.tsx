'use client'

import { useState } from 'react'
import Carousel from '@/components/ui/Carousel'
import LiveFrame from '@/components/ui/LiveFrame'
import useMediaQuery from '@/components/ui/useMediaQuery'
import type { Project } from '@/lib/projects'

/**
 * Prints por padrão e, quando o projeto está no ar, a opção de testar o site
 * dentro da moldura. O notebook reduzido numa tela de celular fica ilegível,
 * então ali a opção vira um link para abrir o site.
 */
export default function ProjectMedia({ project }: { project: Project }) {
  const [mode, setMode] = useState<'shots' | 'live'>('shots')
  const wide = useMediaQuery('(min-width: 768px)')
  const demo = project.demo
  const inline = demo && (demo.device === 'phone' || wide)

  return (
    <div>
      {demo && (
        <div className="mb-8 flex justify-center">
          {inline ? (
            <div
              role="tablist"
              aria-label={`Como ver ${project.name}`}
              className="inline-flex rounded-full border border-graphite-750 bg-graphite-900/70 p-1 backdrop-blur"
            >
              {(
                [
                  ['shots', 'prints'],
                  ['live', 'testar ao vivo'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => setMode(value)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                    mode === value
                      ? 'bg-ink-100 text-graphite-950'
                      : 'text-ink-400 hover:text-ink-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <a
              href={project.live ?? demo.src}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-graphite-750 px-4 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:text-amber-300"
            >
              abrir o site para testar &#8599;
            </a>
          )}
        </div>
      )}

      {mode === 'live' && demo && inline ? (
        <LiveFrame {...demo} title={project.name} />
      ) : (
        <Carousel shots={project.shots} shape={project.shotShape} />
      )}
    </div>
  )
}
