'use client'

import { useEffect, useRef } from 'react'
import useMediaQuery from '@/components/ui/useMediaQuery'

const CELL = 24

// Física da malha: cada nó tem uma mola fraca até o lugar de origem e molas
// fortes até os vizinhos, então ela estica como tecido antes de voltar.
const ANCHOR = 0.012
const LINK = 0.24
const DAMP = 0.86

// Rasgo progressivo: acima de YIELD (em células) o fio vai se desgastando, e
// mais rápido quanto mais esticado; arrebenta quando o desgaste chega a 1, ou
// na hora se passar de SNAP. Abaixo de YIELD o desgaste vai sarando.
const YIELD = 1.3
const SNAP = 2.8
const WEAR = 5
const MEND = 0.6

// Pegada: uma pinça pequena no clique e, enquanto o mouse anda, um gancho que
// fisga a malha por onde passa. Nó que fica longe do cursor vai sendo solto.
const PINCH = 20
const HOOK_RADIUS = 22
const HOOK = 0.95
const LETGO = 0.94
const GRAB = 0.5
const RIPPLE_RADIUS = 150
const RIPPLE_FORCE = 4

// Resistência: com o mouse parado segurando, a malha reage. A pegada afrouxa,
// a âncora puxa mais forte e os fios voltam a crescer mesmo sob o puxão.
const RESIST_AFTER = 220
const RESIST_TIME = 1.4
const RESIST_GRIP = 0.9
const RESIST_ANCHOR = 3

// Link rompido espera um pouco e cresce de volta das duas pontas até o meio.
const REGROW_DELAY = 1.2
const REGROW_TIME = 2.6

const LENS_RADIUS = 170
const LENS_PUSH = 6
const LENS_IDLE = 1500

const LINE = 'rgba(78, 84, 95, 0.28)'
// Fio sob tensão esquenta antes de arrebentar; ponta solta fica desfiada.
const WARM = 'rgba(236, 171, 72, 0.3)'
const HOT = 'rgba(247, 196, 113, 0.75)'
const FRAY = 'rgba(134, 142, 153, 0.5)'

// Camadas de trás, da mais funda pra mais rasa. A malha da frente rola junto
// com a página; estas rolam mais devagar, correm contra o cursor e seguem só
// um pedaço do puxão, e é essa diferença de velocidade que dá profundidade.
const LAYERS = [
  { cell: 192, line: 'rgba(78, 84, 95, 0.09)', scroll: 0.18, mouse: 0.014, pull: 0.1 },
  { cell: 96, line: 'rgba(78, 84, 95, 0.14)', scroll: 0.45, mouse: 0.034, pull: 0.3 },
]

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
 * de leve, clicar no vazio solta uma onda e arrastar puxa a malha, que esquenta
 * e vai arrebentando fio a fio quanto mais longe vai. Parar o mouse segurando
 * faz a malha reagir: afrouxa a pegada e se costura de volta. A malha rola com a página
 * e duas grades mais largas atrás rolam mais devagar, em paralaxe.
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
    // Desgaste acumulado dos mesmos links (0 a 1).
    let rightWear = new Float32Array(0)
    let downWear = new Float32Array(0)
    let grab = new Float32Array(0)
    let pinned = new Uint8Array(0)
    let gx = new Float32Array(0)
    let gy = new Float32Array(0)
    let torn = 0

    const pointer = { x: -9999, y: -9999, inside: false, moved: 0 }
    const lens = { x: -9999, y: -9999, s: 0 }
    // Puxão suavizado que as camadas de trás seguem (e soltam devagar).
    const pull = { x: 0, y: 0 }
    // Ponto do clique em coordenadas da malha, não da tela.
    let drag: { x: number; y: number; moved: boolean } | null = null
    let resist = 0
    let raf = 0

    // A física roda num referencial preso ao documento: a malha está em
    // "base" e é desenhada "o" pixels acima, com o sempre menor que uma célula.
    // Quando a rolagem passa de uma célula, as linhas do array andam uma
    // posição e entra uma linha nova, em repouso, na borda.
    let base = 0
    let o = 0

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
      rightWear = new Float32Array(n)
      downWear = new Float32Array(n)
      grab = new Float32Array(n)
      pinned = new Uint8Array(n)
      gx = new Float32Array(n)
      gy = new Float32Array(n)
      torn = 0
      base = Math.floor(window.scrollY / CELL) * CELL
      o = window.scrollY - base

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          // Meio pixel pra linha de 1px cair inteira num pixel.
          rx[k] = px[k] = (i - 1) * CELL + 0.5
          ry[k] = py[k] = (j - 1) * CELL + 0.5
        }
      }
    }

    const rest = (from: number, to: number) => {
      for (let k = from; k < to; k++) {
        px[k] = rx[k]
        py[k] = ry[k]
        vx[k] = vy[k] = grab[k] = pinned[k] = rightWear[k] = downWear[k] = 0
        gx[k] = rx[k]
        gy[k] = ry[k]
        right[k] = down[k] = 1
      }
    }

    const shift = (dir: 1 | -1) => {
      const n = cols * rows
      const moving = [px, py, vx, vy, right, down, rightWear, downWear, grab, pinned, gx, gy]
      if (dir === 1) {
        for (const a of moving) a.copyWithin(0, cols)
        for (let k = 0; k < n - cols; k++) {
          py[k] -= CELL
          gy[k] -= CELL
        }
        rest(n - cols, n)
      } else {
        for (const a of moving) a.copyWithin(cols, 0, n - cols)
        for (let k = cols; k < n; k++) {
          py[k] += CELL
          gy[k] += CELL
        }
        rest(0, cols)
      }
      if (drag) drag.y -= dir * CELL
    }

    const sync = () => {
      const sy = window.scrollY
      const d = Math.floor((sy - base) / CELL)
      if (d !== 0) {
        if (Math.abs(d) >= rows) {
          rest(0, cols * rows)
          drag = null
        } else {
          for (let s = 0; s < Math.abs(d); s++) shift(d > 0 ? 1 : -1)
        }
        base += d * CELL
        torn = 0
        for (const health of [right, down]) for (const v of health) if (v < 1) torn++
      }
      o = sy - base
    }

    const spring = (
      a: number,
      b: number,
      health: Float32Array,
      wear: Float32Array,
      ax: Float32Array,
      ay: Float32Array,
      dt: number,
    ) => {
      if (health[a] < 1) return
      const dx = px[b] - px[a]
      const dy = py[b] - py[a]
      const len = Math.hypot(dx, dy) || 1
      const stretch = len / CELL
      if (stretch > YIELD) {
        wear[a] += (stretch - YIELD) * WEAR * dt
        if (wear[a] >= 1 || stretch > SNAP) {
          health[a] = -REGROW_DELAY / REGROW_TIME
          wear[a] = 0
          torn++
          return
        }
      } else if (wear[a] > 0) {
        wear[a] = Math.max(0, wear[a] - MEND * dt)
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

      const anchor = ANCHOR * (1 + RESIST_ANCHOR * resist)
      for (let k = 0; k < n; k++) {
        ax[k] = (rx[k] - px[k]) * anchor
        ay[k] = (ry[k] - py[k]) * anchor
      }

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          if (i < cols - 1) spring(k, k + 1, right, rightWear, ax, ay, dt)
          if (j < rows - 1) spring(k, k + cols, down, downWear, ax, ay, dt)
        }
      }

      const ox = drag ? pointer.x - drag.x : 0
      const oy = drag ? pointer.y + o - drag.y : 0

      // Com o mouse andando, o gancho fisga o que está embaixo dele e solta
      // aos poucos o que ficou pra trás. Pedaço arrancado volta pra casa e o
      // puxão segue rasgando malha nova, em vez de levar um bloco junto.
      if (drag?.moved && resist === 0) {
        const hx = pointer.x
        const hy = pointer.y + o
        for (let k = 0; k < n; k++) {
          const d = Math.hypot(px[k] - hx, py[k] - hy)
          if (d < HOOK_RADIUS) {
            const w = HOOK * (1 - d / HOOK_RADIUS)
            if (w > grab[k]) {
              grab[k] = w
              gx[k] = px[k] - ox * w
              gy[k] = py[k] - oy * w
            }
          } else if (grab[k] > 0 && !pinned[k]) {
            grab[k] = grab[k] < 0.02 ? 0 : grab[k] * LETGO
          }
        }
      }

      // A pinça do clique segura até o nó perder todos os fios. Aí ele volta
      // pra casa e quem segue puxando é o gancho.
      if (drag) {
        for (let k = 0; k < n; k++) {
          if (!pinned[k]) continue
          const linked =
            right[k] >= 1 ||
            down[k] >= 1 ||
            (k % cols > 0 && right[k - 1] >= 1) ||
            (k >= cols && down[k - cols] >= 1)
          if (!linked) pinned[k] = grab[k] = 0
        }
      }

      const grip = GRAB * (1 - RESIST_GRIP * resist)
      let restless = false
      for (let k = 0; k < n; k++) {
        vx[k] = (vx[k] + ax[k]) * DAMP
        vy[k] = (vy[k] + ay[k]) * DAMP
        // Nó agarrado vai junto com o cursor, mais preso quanto mais perto do
        // ponto do clique. É isso que estica a malha até rasgar.
        if (drag && grab[k] > 0) {
          const pull = grab[k] * grip
          vx[k] += (gx[k] + ox * grab[k] - px[k] - vx[k]) * pull
          vy[k] += (gy[k] + oy * grab[k] - py[k] - vy[k]) * pull
        }
        px[k] += vx[k]
        py[k] += vy[k]
        if (!restless && (Math.abs(vx[k]) > 0.01 || Math.abs(px[k] - rx[k]) > 0.05 || Math.abs(py[k] - ry[k]) > 0.05)) {
          restless = true
        }
      }

      // Solto, tudo se refaz. Segurando parado, refaz na medida da resistência.
      const regrow = drag ? resist * 1.6 : 1
      if (torn > 0 && regrow > 0) {
        for (const [health, next] of [[right, 1], [down, cols]] as const) {
          for (let k = 0; k < n; k++) {
            if (health[k] >= 1) continue
            const grown = health[k] + (dt / REGROW_TIME) * regrow
            if (grown < 1) {
              health[k] = grown
              continue
            }
            // Só fecha se as pontas já se aproximaram; senão fica por um fio.
            const b = k + next
            if (Math.hypot(px[b] - px[k], py[b] - py[k]) < CELL * YIELD) {
              health[k] = 1
              torn--
            } else {
              health[k] = 0.97
            }
          }
        }
      }

      return !restless && torn === 0 && !drag
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1

      const mx = lens.x > -999 ? lens.x - w / 2 : 0
      const my = lens.y > -999 ? lens.y - h / 2 : 0
      const sy = window.scrollY
      for (const layer of LAYERS) {
        const { cell } = layer
        const ox = -mx * layer.mouse + pull.x * layer.pull
        const oy = -my * layer.mouse + pull.y * layer.pull - sy * layer.scroll
        const bx = (((ox % cell) + cell) % cell) - cell + 0.5
        const by = (((oy % cell) + cell) % cell) - cell + 0.5
        ctx.beginPath()
        for (let x = bx; x < w + cell; x += cell) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
        }
        for (let y = by; y < h + cell; y += cell) {
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
        }
        ctx.strokeStyle = layer.line
        ctx.stroke()
      }

      // Daqui pra baixo, tudo em coordenadas da malha.
      ctx.setTransform(dpr, 0, 0, dpr, 0, -o * dpr)
      const lx = lens.x
      const ly = lens.y + o

      const n = cols * rows
      const push = LENS_PUSH * lens.s
      for (let k = 0; k < n; k++) {
        let x = px[k]
        let y = py[k]
        if (push > 0.01) {
          const dx = x - lx
          const dy = y - ly
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
      const warm = new Path2D()
      const hot = new Path2D()
      const fray = new Path2D()
      const mend = new Path2D()
      // Trecho que sai de a em direção a b, com fração t do comprimento.
      const reach = (path: Path2D, a: number, b: number, t: number) => {
        path.moveTo(qx[a], qy[a])
        path.lineTo(qx[a] + (qx[b] - qx[a]) * t, qy[a] + (qy[b] - qy[a]) * t)
      }
      const link = (a: number, b: number, health: number) => {
        if (health >= 1) {
          const stretch = Math.hypot(px[b] - px[a], py[b] - py[a]) / CELL
          const path = stretch > YIELD ? hot : stretch > 1.12 ? warm : mesh
          path.moveTo(qx[a], qy[a])
          path.lineTo(qx[b], qy[b])
          return
        }
        // Ponta desfiada de alguns pixels, e o fio novo crescendo além dela.
        const len = Math.hypot(qx[b] - qx[a], qy[b] - qy[a]) || 1
        const stub = Math.min(0.3, 6 / len)
        reach(fray, a, b, stub)
        reach(fray, b, a, stub)
        const t = health / 2
        if (t > stub) {
          reach(mend, a, b, t)
          reach(mend, b, a, t)
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
      ctx.strokeStyle = FRAY
      ctx.stroke(fray)
      ctx.strokeStyle = WARM
      ctx.stroke(warm)
      ctx.strokeStyle = HOT
      ctx.stroke(hot)

      if (lens.s > 0.01) {
        const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, LENS_RADIUS)
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

      if (drag?.moved && time - pointer.moved > RESIST_AFTER) {
        resist = Math.min(1, resist + dt / RESIST_TIME)
      } else {
        resist = Math.max(0, resist - dt * 4)
      }

      const tx = drag ? pointer.x - drag.x : 0
      const ty = drag ? pointer.y + o - drag.y : 0
      pull.x += (tx - pull.x) * 0.1
      pull.y += (ty - pull.y) * 0.1

      sync()
      const still = step(dt)
      draw()

      const lensDone = target === 0 && lens.s < 0.003
      const pullDone = !drag && Math.abs(pull.x) < 0.05 && Math.abs(pull.y) < 0.05
      if (still && lensDone && pullDone) {
        pull.x = pull.y = 0
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
      if (drag && Math.hypot(pointer.x - drag.x, pointer.y + o - drag.y) > 4) drag.moved = true
      wake()
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (!isBlank(event.target, event.clientX, event.clientY)) return

      sync()
      drag = { x: event.clientX, y: event.clientY + o, moved: false }
      resist = 0
      for (let k = 0; k < grab.length; k++) {
        const d = Math.hypot(px[k] - drag.x, py[k] - drag.y)
        // Pinça: só os nós colados ao clique ficam presos de verdade. O resto
        // da malha vem junto pelos fios, como tecido, até eles cederem.
        const w = Math.exp(-((d / PINCH) ** 2))
        grab[k] = w < 0.03 ? 0 : w
        pinned[k] = grab[k] > 0 ? 1 : 0
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
      pinned.fill(0)
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
    window.addEventListener('scroll', wake, { passive: true })

    return () => {
      delete host.dataset.live
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('selectstart', onSelect)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', wake)
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
