'use client'

import { useEffect, useRef } from 'react'
import useMediaQuery from '@/components/ui/useMediaQuery'

const CELL = 24
const BACK_CELL = 96

// Física da malha: cada nó tem uma mola fraca até o lugar de origem e molas
// fortes até os vizinhos, então ela estica como tecido antes de voltar.
const ANCHOR = 0.012
const LINK = 0.24
const DAMP = 0.86
const TEAR = 2.4 // link arrebenta ao passar de 2,4x o tamanho da célula

const GRAB_RADIUS = 90
const GRAB_CORE = 42
const GRAB = 0.5
const RIPPLE_RADIUS = 150
const RIPPLE_FORCE = 4

// Link rompido espera um pouco e cresce de volta das duas pontas até o meio.
const REGROW_DELAY = 1.2
const REGROW_TIME = 2.6

const LENS_RADIUS = 170
const LENS_PUSH = 6
const LENS_IDLE = 1500
const PARALLAX = 0.018

const LINE = 'rgba(78, 84, 95, 0.28)'
const BACK_LINE = 'rgba(78, 84, 95, 0.13)'

// Arrastar só começa onde não há nada: fora de links, botões, mídia, texto e
// superfícies com fundo próprio (cartões, barra de navegação).
const SOLID =
  'a,button,input,textarea,select,label,iframe,img,video,svg,pre,code,[role="button"],[data-grid-skip]'

function isBlank(target: EventTarget | null, x: number, y: number) {
  if (!(target instanceof Element) || target.closest(SOLID)) return false

  for (let el: Element | null = target; el && el !== document.body; el = el.parentElement) {
    const style = getComputedStyle(el)
    if (style.backgroundImage !== 'none') return false
    if (!/^(transparent|rgba\(0, 0, 0, 0\))$/.test(style.backgroundColor)) return false
  }

  // Em cima de texto, deixa a seleção funcionar normalmente.
  const range = document.createRange()
  for (const node of target.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return false
    }
  }

  return true
}

/**
 * Fundo de papel milimetrado desenhado em canvas. O cursor faz a grade abaular
 * de leve, clicar no vazio solta uma onda e arrastar puxa a malha, que rasga
 * se for longe demais e se costura sozinha depois.
 *
 * Sem ponteiro fino ou com movimento reduzido, fica só a grade em CSS.
 */
export default function GridField() {
  const fine = useMediaQuery('(pointer: fine)')
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enabled = fine && !calm

  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!enabled || !host || !canvas || !ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let cols = 0
    let rows = 0
    let px = new Float32Array(0)
    let py = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let rx = new Float32Array(0)
    let ry = new Float32Array(0)
    let qx = new Float32Array(0) // posição desenhada, já com a lente
    let qy = new Float32Array(0)
    // Saúde dos links à direita e abaixo de cada nó: 1 inteiro, abaixo disso
    // rompido (negativo enquanto espera para começar a crescer).
    let right = new Float32Array(0)
    let down = new Float32Array(0)
    let grab = new Float32Array(0)
    let gx = new Float32Array(0)
    let gy = new Float32Array(0)
    let torn = 0

    const pointer = { x: -9999, y: -9999, inside: false, moved: 0 }
    const lens = { x: -9999, y: -9999, s: 0 }
    let drag: { x: number; y: number; moved: boolean } | null = null
    let raf = 0

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // Uma célula de folga em cada borda, pra malha puxada não mostrar o fim.
      cols = Math.ceil(w / CELL) + 3
      rows = Math.ceil(h / CELL) + 3
      const n = cols * rows
      px = new Float32Array(n)
      py = new Float32Array(n)
      vx = new Float32Array(n)
      vy = new Float32Array(n)
      rx = new Float32Array(n)
      ry = new Float32Array(n)
      qx = new Float32Array(n)
      qy = new Float32Array(n)
      right = new Float32Array(n).fill(1)
      down = new Float32Array(n).fill(1)
      grab = new Float32Array(n)
      gx = new Float32Array(n)
      gy = new Float32Array(n)
      torn = 0

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          // Meio pixel pra linha de 1px cair inteira num pixel.
          rx[k] = px[k] = (i - 1) * CELL + 0.5
          ry[k] = py[k] = (j - 1) * CELL + 0.5
        }
      }
    }

    const spring = (a: number, b: number, health: Float32Array, ax: Float32Array, ay: Float32Array) => {
      if (health[a] < 1) return
      const dx = px[b] - px[a]
      const dy = py[b] - py[a]
      const len = Math.hypot(dx, dy) || 1
      if (len > CELL * TEAR) {
        health[a] = -REGROW_DELAY / REGROW_TIME
        torn++
        return
      }
      const f = (LINK * (len - CELL)) / len
      ax[a] += dx * f
      ay[a] += dy * f
      ax[b] -= dx * f
      ay[b] -= dy * f
    }

    let ax = new Float32Array(0)
    let ay = new Float32Array(0)

    // Devolve true quando a malha parou e está inteira.
    const step = (dt: number) => {
      const n = cols * rows
      if (ax.length !== n) {
        ax = new Float32Array(n)
        ay = new Float32Array(n)
      }

      for (let k = 0; k < n; k++) {
        ax[k] = (rx[k] - px[k]) * ANCHOR
        ay[k] = (ry[k] - py[k]) * ANCHOR
      }

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          if (i < cols - 1) spring(k, k + 1, right, ax, ay)
          if (j < rows - 1) spring(k, k + cols, down, ax, ay)
        }
      }

      const ox = drag ? pointer.x - drag.x : 0
      const oy = drag ? pointer.y - drag.y : 0

      let restless = false
      for (let k = 0; k < n; k++) {
        vx[k] = (vx[k] + ax[k]) * DAMP
        vy[k] = (vy[k] + ay[k]) * DAMP
        // Nó agarrado vai junto com o cursor, mais preso quanto mais perto do
        // ponto do clique. É isso que estica a malha até rasgar.
        if (drag && grab[k] > 0) {
          const pull = grab[k] * GRAB
          vx[k] += (gx[k] + ox * grab[k] - px[k] - vx[k]) * pull
          vy[k] += (gy[k] + oy * grab[k] - py[k] - vy[k]) * pull
        }
        px[k] += vx[k]
        py[k] += vy[k]
        if (!restless && (Math.abs(vx[k]) > 0.01 || Math.abs(px[k] - rx[k]) > 0.05 || Math.abs(py[k] - ry[k]) > 0.05)) {
          restless = true
        }
      }

      if (torn > 0 && !drag) {
        for (const health of [right, down]) {
          for (let k = 0; k < n; k++) {
            if (health[k] >= 1) continue
            health[k] = Math.min(1, health[k] + dt / REGROW_TIME)
            if (health[k] === 1) torn--
          }
        }
      }

      return !restless && torn === 0 && !drag
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1

      // Camada de trás: grade larga e mais apagada, que corre um pouco contra
      // o cursor. É ela que dá a sensação de profundidade.
      const ox = lens.x > -999 ? (lens.x - w / 2) * -PARALLAX : 0
      const oy = lens.y > -999 ? (lens.y - h / 2) * -PARALLAX : 0
      ctx.beginPath()
      const bx = (((ox % BACK_CELL) + BACK_CELL) % BACK_CELL) - BACK_CELL + 0.5
      const by = (((oy % BACK_CELL) + BACK_CELL) % BACK_CELL) - BACK_CELL + 0.5
      for (let x = bx; x < w + BACK_CELL; x += BACK_CELL) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = by; y < h + BACK_CELL; y += BACK_CELL) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.strokeStyle = BACK_LINE
      ctx.stroke()

      const n = cols * rows
      const push = LENS_PUSH * lens.s
      for (let k = 0; k < n; k++) {
        let x = px[k]
        let y = py[k]
        if (push > 0.01) {
          const dx = x - lens.x
          const dy = y - lens.y
          const d = Math.hypot(dx, dy)
          if (d < LENS_RADIUS && d > 0.001) {
            const f = 1 - d / LENS_RADIUS
            x += (dx / d) * push * f * f
            y += (dy / d) * push * f * f
          }
        }
        qx[k] = x
        qy[k] = y
      }

      const mesh = new Path2D()
      const mend = new Path2D()
      const link = (a: number, b: number, health: number) => {
        if (health >= 1) {
          mesh.moveTo(qx[a], qy[a])
          mesh.lineTo(qx[b], qy[b])
        } else if (health > 0) {
          const t = health / 2
          mend.moveTo(qx[a], qy[a])
          mend.lineTo(qx[a] + (qx[b] - qx[a]) * t, qy[a] + (qy[b] - qy[a]) * t)
          mend.moveTo(qx[b], qy[b])
          mend.lineTo(qx[b] + (qx[a] - qx[b]) * t, qy[b] + (qy[a] - qy[b]) * t)
        }
      }
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          if (i < cols - 1) link(k, k + 1, right[k])
          if (j < rows - 1) link(k, k + cols, down[k])
        }
      }

      ctx.strokeStyle = LINE
      ctx.stroke(mesh)

      if (lens.s > 0.01) {
        const glow = ctx.createRadialGradient(lens.x, lens.y, 0, lens.x, lens.y, LENS_RADIUS)
        glow.addColorStop(0, `rgba(236, 171, 72, ${0.22 * lens.s})`)
        glow.addColorStop(1, 'rgba(236, 171, 72, 0)')
        ctx.strokeStyle = glow
        ctx.stroke(mesh)
      }

      // Fio se refazendo: âmbar, até fechar e voltar ao cinza.
      if (torn > 0) {
        ctx.strokeStyle = 'rgba(236, 171, 72, 0.45)'
        ctx.stroke(mend)
      }
    }

    let last = 0
    const frame = (time: number) => {
      raf = 0
      const dt = Math.min((time - (last || time)) / 1000, 1 / 30) || 1 / 60
      last = time

      const target = pointer.inside && time - pointer.moved < LENS_IDLE ? 1 : 0
      lens.s += (target - lens.s) * 0.07
      if (lens.x < -999) {
        lens.x = pointer.x
        lens.y = pointer.y
      } else {
        lens.x += (pointer.x - lens.x) * 0.16
        lens.y += (pointer.y - lens.y) * 0.16
      }

      const still = step(dt)
      draw()

      const lensDone = target === 0 && lens.s < 0.003
      if (still && lensDone) {
        lens.s = 0
        last = 0
        draw()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const wake = () => {
      raf ||= requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.inside = true
      pointer.moved = performance.now()
      if (drag && Math.hypot(pointer.x - drag.x, pointer.y - drag.y) > 4) drag.moved = true
      wake()
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (!isBlank(event.target, event.clientX, event.clientY)) return

      drag = { x: event.clientX, y: event.clientY, moved: false }
      for (let k = 0; k < grab.length; k++) {
        const d = Math.hypot(px[k] - drag.x, py[k] - drag.y)
        // Miolo preso por inteiro (move como um pedaço de pano) e um anel em
        // volta que vai soltando. É no anel que a malha estica e rasga.
        const f = Math.min(1, Math.max(0, (GRAB_RADIUS - d) / (GRAB_RADIUS - GRAB_CORE)))
        grab[k] = f * f * (3 - 2 * f)
        gx[k] = px[k]
        gy[k] = py[k]
      }
      wake()
    }

    const onUp = () => {
      if (!drag) return
      if (!drag.moved) {
        // Clique sem arrastar: uma onda saindo do ponto.
        for (let k = 0; k < px.length; k++) {
          const dx = px[k] - drag.x
          const dy = py[k] - drag.y
          const d = Math.hypot(dx, dy)
          if (d >= RIPPLE_RADIUS || d < 0.001) continue
          const f = (1 - d / RIPPLE_RADIUS) * RIPPLE_FORCE
          vx[k] += (dx / d) * f
          vy[k] += (dy / d) * f
        }
      }
      drag = null
      grab.fill(0)
      wake()
    }

    // Enquanto puxa a malha, o navegador não seleciona o texto do caminho.
    const onSelect = (event: Event) => {
      if (drag) event.preventDefault()
    }

    const onLeave = () => {
      pointer.inside = false
      onUp()
    }

    let resizing = 0
    const onResize = () => {
      cancelAnimationFrame(resizing)
      resizing = requestAnimationFrame(() => {
        build()
        draw()
      })
    }

    build()
    draw()
    host.dataset.live = 'true'

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('blur', onLeave)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('selectstart', onSelect)
    window.addEventListener('resize', onResize)

    return () => {
      delete host.dataset.live
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('selectstart', onSelect)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizing)
    }
  }, [enabled])

  return (
    <div ref={hostRef} className="backdrop" aria-hidden>
      {enabled && <canvas ref={canvasRef} />}
    </div>
  )
}
