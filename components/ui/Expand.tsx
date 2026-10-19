'use client'

import { useId, useState, type ReactNode } from 'react'

/**
 * "Ver mais" de um projeto. A altura anima com grid-template-rows (0fr → 1fr),
 * que acompanha o conteúdo sem precisar medir nada.
 */
export default function Expand({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="group inline-flex cursor-pointer items-center gap-2 font-mono text-sm text-ink-300 transition-colors hover:text-amber-300"
      >
        {open ? 'ver menos' : 'ver mais sobre o projeto'}
        <span
          aria-hidden
          className={`inline-block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          &#8595;
        </span>
      </button>

      <div
        id={id}
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="pt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
