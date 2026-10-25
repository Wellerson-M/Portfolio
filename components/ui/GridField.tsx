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

const LINE = 'rgba(112, 122, 140, 0.4)'
// Fio sob tensão esquenta antes de arrebentar; ponta solta fica desfiada.
const WARM = 'rgba(236, 171, 72, 0.34)'
const HOT = 'rgba(247, 196, 113, 0.8)'
const FRAY = 'rgba(150, 160, 172, 0.55)'

// Por baixo do tecido há outra coisa viva: onde o fio rompe, ela aparece
// brilhando (âmbar na ferida, ciano e violeta enquanto se refaz).
const AMBER = '247, 190, 100'
const CYAN = '92, 214, 224'
const VIOLET = '146, 118, 255'

// Camadas de trás, da mais funda pra mais rasa. A malha da frente rola junto
// com a página; estas rolam mais devagar, correm contra o cursor e seguem só
// um pedaço do puxão, e é essa diferença de velocidade que dá profundidade.
// Cada uma ondula sozinha, como pano flutuando em líquido.
const LAYERS = [
  { cell: 240, rgb: VIOLET, alpha: 0.13, scroll: 0.14, mouse: 0.014, pull: 0.1, amp: 30, freq: 0.0026, speed: 0.22 },
  { cell: 120, rgb: CYAN, alpha: 0.13, scroll: 0.34, mouse: 0.03, pull: 0.25, amp: 15, freq: 0.0048, speed: 0.38 },
  { cell: 60, rgb: '150, 160, 186', alpha: 0.13, scroll: 0.6, mouse: 0.05, pull: 0.45, amp: 6, freq: 0.01, speed: 0.55 },
]

// Manchas de luz à deriva no fundo e esporos que flutuam em três profundidades.
const BLOBS = [
  { rgb: VIOLET, alpha: 0.11, r: 0.55, x: 0.22, y: 0.3, sx: 0.07, sy: 0.05, scroll: 0.1 },
  { rgb: CYAN, alpha: 0.085, r: 0.5, x: 0.78, y: 0.55, sx: 0.06, sy: 0.08, scroll: 0.16 },
  { rgb: AMBER, alpha: 0.07, r: 0.4, x: 0.5, y: 0.85, sx: 0.09, sy: 0.04, scroll: 0.22 },
]
const MOTES = 70
const MOTE_LINK = 130
const SPARKS = 360

type Mote = { x: number; y: number; z: number; hue: number; seed: number }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; age: number; hue: number }

const RGB = [AMBER, CYAN, VIOLET]

function sprite(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${rgb}, 1)`)
  grad.addColorStop(0.22, `rgba(${rgb}, 0.38)`)
  grad.addColorStop(1, `rgba(${rgb}, 0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

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
 * Por baixo e ao redor, o fundo tem vida própria: névoa de luz à deriva, três
 * grades que ondulam em profundidades diferentes e esporos ligados por fios.
 * Cada rasgo deixa à mostra uma luz que muda de âmbar para ciano e violeta,
 * solta fagulhas, e é costurado de volta por fios que se enroscam.
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
    let clock = 0

    const glows = RGB.map(sprite)
    const motes: Mote[] = []
    const sparks: Spark[] = []

    const pointer ={ x: -9999, y: -9999, inside: false, moved: 0 }
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

      motes.length = 0
      const count = Math.round(MOTES * Math.min(1.4, (w * h) / (1440 * 900)))
      for (let m = 0; m < count; m++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.25 + Math.random() * 0.75,
          hue: Math.random() < 0.5 ? 1 : Math.random() < 0.6 ? 2 : 0,
          seed: Math.random() * 100,
        })
      }

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

    // Fagulhas que escapam do fio quando ele rompe (x e y já em coordenadas da tela).
    const burst = (x: number, y: number) => {
      for (let s = 0; s < 3; s++) {
        if (sparks.length >= SPARKS) sparks.shift()
        const a = Math.random() * Math.PI * 2
        const v = 18 + Math.random() * 60
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 10,
          life: 0.9 + Math.random() * 1.4,
          age: 0,
          hue: Math.random() < 0.55 ? 0 : 1,
        })
      }
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
          burst((px[a] + px[b]) / 2, (py[a] + py[b]) / 2 - o)
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

      // Névoa de luz ao fundo, à deriva.
      ctx.globalCompositeOperation = 'lighter'
      for (const [b, blob] of BLOBS.entries()) {
        const r = blob.r * Math.max(w, h)
        const bx = w * (blob.x + Math.sin(clock * blob.sx + b * 2) * 0.12) - mx * 0.03
        const by = h * (blob.y + Math.cos(clock * blob.sy + b * 3) * 0.12) - sy * blob.scroll - my * 0.03
        const cloud = ctx.createRadialGradient(bx, by, 0, bx, by, r)
        cloud.addColorStop(0, `rgba(${blob.rgb}, ${blob.alpha})`)
        cloud.addColorStop(1, `rgba(${blob.rgb}, 0)`)
        ctx.fillStyle = cloud
        ctx.fillRect(0, 0, w, h)
      }
      ctx.globalCompositeOperation = 'source-over'

      // Grades de fundo: linhas que ondulam em fases diferentes, então os
      // cruzamentos deslizam uns sobre os outros.
      for (const layer of LAYERS) {
        const { cell, amp, freq, speed } = layer
        const ox = -mx * layer.mouse + pull.x * layer.pull
        const oy = -my * layer.mouse + pull.y * layer.pull - sy * layer.scroll
        const ix = Math.floor(ox / cell)
        const iy = Math.floor(oy / cell)
        const bx = ox - ix * cell - cell + 0.5
        const by = oy - iy * cell - cell + 0.5
        const phase = clock * speed
        ctx.beginPath()
        for (let x = bx, i = ix - 1; x < w + cell; x += cell, i++) {
          for (let y = -24; y <= h + 24; y += 24) {
            const xx = x + Math.sin(y * freq + phase + i * 1.9) * amp
            if (y === -24) ctx.moveTo(xx, y)
            else ctx.lineTo(xx, y)
          }
        }
        for (let y = by, j = iy - 1; y < h + cell; y += cell, j++) {
          for (let x = -24; x <= w + 24; x += 24) {
            const yy = y + Math.sin(x * freq - phase + j * 2.3) * amp
            if (x === -24) ctx.moveTo(x, yy)
            else ctx.lineTo(x, yy)
          }
        }
        ctx.strokeStyle = `rgba(${layer.rgb}, ${layer.alpha})`
        ctx.stroke()
      }

      // Esporos: pontos de luz com profundidade, ligados por fios finos
      // quando passam perto uns dos outros.
      ctx.globalCompositeOperation = 'lighter'
      const live = motes.map((m) => {
        const x = m.x - mx * 0.04 * m.z + pull.x * 0.12 * m.z
        const y = (((m.y - sy * 0.3 * m.z - my * 0.04 * m.z) % h) + h) % h
        return { x: ((x % w) + w) % w, y, m }
      })
      ctx.lineWidth = 0.8
      for (let a = 0; a < live.length; a++) {
        for (let b = a + 1; b < live.length; b++) {
          const dz = Math.abs(live[a].m.z - live[b].m.z)
          if (dz > 0.3) continue
          const d = Math.hypot(live[a].x - live[b].x, live[a].y - live[b].y)
          if (d > MOTE_LINK) continue
          ctx.strokeStyle = `rgba(${RGB[live[a].m.hue]}, ${(1 - d / MOTE_LINK) * 0.16 * live[a].m.z})`
          ctx.beginPath()
          ctx.moveTo(live[a].x, live[a].y)
          ctx.lineTo(live[b].x, live[b].y)
          ctx.stroke()
        }
      }
      ctx.lineWidth = 1
      for (const { x, y, m } of live) {
        const size = 8 + 18 * m.z
        ctx.globalAlpha = (0.35 + 0.35 * Math.sin(clock * 1.3 + m.seed)) * m.z
        ctx.drawImage(glows[m.hue], x - size / 2, y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

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
      const wounds: number[] = [] // x, y, progresso, de cada link rompido
      const tips: number[] = [] // x, y, de cada ponta de fio crescendo
      // Trecho que sai de a em direção a b, com fração t do comprimento, em
      // espiral: dois fios que se enroscam enquanto crescem, como se o pano
      // se tecesse sozinho.
      const reach = (path: Path2D, a: number, b: number, t: number, seed: number, grow: number) => {
        const dx = qx[b] - qx[a]
        const dy = qy[b] - qy[a]
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len
        const ny = dx / len
        const ex = qx[a] + dx * t
        const ey = qy[a] + dy * t
        const wob = Math.sin(clock * 3.2 + seed) * 5 * grow
        const mx = (qx[a] + ex) / 2
        const my = (qy[a] + ey) / 2
        for (const side of [1, -1]) {
          path.moveTo(qx[a], qy[a])
          path.quadraticCurveTo(mx + nx * wob * side, my + ny * wob * side, ex, ey)
        }
        tips.push(ex, ey)
      }
      // Ponta desfiada: o fio rompido solta fibrilas que balançam.
      const frayEnd = (a: number, b: number, stub: number, seed: number) => {
        const dx = qx[b] - qx[a]
        const dy = qy[b] - qy[a]
        const ex = qx[a] + dx * stub
        const ey = qy[a] + dy * stub
        fray.moveTo(qx[a], qy[a])
        fray.lineTo(ex, ey)
        const heading = Math.atan2(dy, dx)
        for (let f = 0; f < 3; f++) {
          const ang = heading + (f - 1) * 0.7 + Math.sin(clock * 2 + seed + f * 2) * 0.45
          const reachLen = 5 + ((seed * 7 + f * 13) % 8)
          fray.moveTo(ex, ey)
          fray.quadraticCurveTo(
            ex + Math.cos(ang) * reachLen * 0.5 + Math.sin(ang) * 2,
            ey + Math.sin(ang) * reachLen * 0.5 - Math.cos(ang) * 2,
            ex + Math.cos(ang + 0.5) * reachLen,
            ey + Math.sin(ang + 0.5) * reachLen,
          )
        }
      }
      const link =(a: number, b: number, health: number, k: number) => {
        if (health >= 1) {
          const stretch = Math.hypot(px[b] - px[a], py[b] - py[a]) / CELL
          const target = stretch > YIELD ? hot : stretch > 1.12 ? warm : mesh
          target.moveTo(qx[a], qy[a])
          target.lineTo(qx[b], qy[b])
          return
        }
        // Ponta desfiada de alguns pixels, e o fio novo crescendo além dela.
        const len = Math.hypot(qx[b] - qx[a], qy[b] - qy[a]) || 1
        const stub = Math.min(0.3, 6 / len)
        frayEnd(a, b, stub, k)
        frayEnd(b, a, stub, k + 1)
        const progress = Math.min(1, Math.max(0, (health + REGROW_DELAY / REGROW_TIME) / (1 + REGROW_DELAY / REGROW_TIME)))
        wounds.push((qx[a] + qx[b]) / 2, (qy[a] + qy[b]) / 2, progress)
        const t = health / 2
        if (t > stub) {
          reach(mend, a, b, t, k, 1 - progress)
          reach(mend, b, a, t, k + 5, 1 - progress)
        }
      }
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          if (i < cols - 1) link(k, k + 1, right[k], k)
          if (j < rows - 1) link(k, k + cols, down[k], k + 3)
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

      // O que há por baixo do pano aparece pelos rasgos: âmbar na ferida
      // fresca, ciano e depois violeta conforme ela se fecha.
      ctx.globalCompositeOperation = 'lighter'
      for (let q = 0; q < wounds.length; q += 3) {
        const p = wounds[q + 2]
        const x = wounds[q]
        const y = wounds[q + 1]
        const pulse = 0.85 + 0.15 * Math.sin(clock * 4 + q)
        const fresh = Math.max(0, 1 - p * 2.2)
        const mid = Math.sin(Math.min(1, p * 1.25) * Math.PI)
        const late = Math.max(0, p * 1.6 - 0.6)
        if (fresh > 0.01) {
          ctx.globalAlpha = 0.9 * fresh * pulse
          ctx.drawImage(glows[0], x - 22, y - 22, 44, 44)
        }
        ctx.globalAlpha = 0.75 * mid * pulse
        ctx.drawImage(glows[1], x - 30, y - 30, 60, 60)
        if (late > 0.01) {
          ctx.globalAlpha = 0.5 * late * (1 - p * 0.6)
          ctx.drawImage(glows[2], x - 26, y - 26, 52, 52)
        }
      }

      // Fio se refazendo: ciano brilhante, até fechar e voltar ao cinza.
      if (torn > 0) {
        ctx.globalAlpha = 1
        ctx.strokeStyle = `rgba(${CYAN}, 0.6)`
        ctx.stroke(mend)
        for (let q = 0; q < tips.length; q += 2) {
          ctx.globalAlpha = 0.9
          ctx.drawImage(glows[1], tips[q] - 7, tips[q + 1] - 7, 14, 14)
        }
      }
      ctx.globalAlpha = 1

      // Fagulhas, já em coordenadas da tela.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const s of sparks) {
        const life = 1 - s.age / s.life
        const size = 5 + 10 * life
        ctx.globalAlpha = life * life * 0.9
        ctx.drawImage(glows[s.hue], s.x - size / 2, s.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
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

      clock += dt

      // Esporos seguem uma correnteza lenta; fagulhas sobem e se apagam.
      for (const m of motes) {
        const flow = Math.sin(m.x * 0.004 + clock * 0.12 + m.seed) + Math.cos(m.y * 0.005 - clock * 0.1)
        m.x += Math.cos(flow * 1.6) * 9 * m.z * dt
        m.y += Math.sin(flow * 1.6) * 9 * m.z * dt
        if (m.x < 0) m.x += w
        else if (m.x > w) m.x -= w
      }
      for (let s = sparks.length - 1; s >= 0; s--) {
        const p = sparks[s]
        p.age += dt
        if (p.age >= p.life) {
          sparks.splice(s, 1)
          continue
        }
        p.vx *= 0.98
        p.vy = p.vy * 0.98 - 14 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
      }

      sync()
      step(dt)
      draw()

      // O fundo respira sozinho, então o laço nunca dorme.
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
    wake()

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
