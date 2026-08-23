import { PULSE_ORIGIN, scriptSrc } from './sites'

export { PULSE_ORIGIN, scriptSrc, sites } from './sites'
export {
  portfolioEvents,
  writesEvents,
  cardorbitEvents,
  chessSchoolEvents,
} from './events'

export type TrackProps = Record<string, string | number | boolean>

export type TrackAttrs = {
  'data-track'?: string
  'data-track-target'?: string
}

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: TrackProps) => void
      identify?: (id: string, data?: TrackProps) => void
    }
  }
}

const SCRIPT_ATTR = 'data-pulse-loaded'

export function track(name: string, data?: TrackProps) {
  if (typeof window === 'undefined') return
  window.umami?.track(name, data)
}

export function identify(id: string, data?: TrackProps) {
  if (typeof window === 'undefined') return
  window.umami?.identify?.(id, data)
}

export function trackProps(name: string, target?: string): TrackAttrs {
  return {
    'data-track': name,
    ...(target ? { 'data-track-target': target } : {}),
  }
}

export type LoadPulseOptions = {
  websiteId: string
  origin?: string
  domains?: string
}

export function loadPulse(options: LoadPulseOptions) {
  if (typeof document === 'undefined' || !options.websiteId) return () => undefined

  const src = scriptSrc(options.origin ?? PULSE_ORIGIN)
  const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`)
  if (existing?.getAttribute('data-website-id') === options.websiteId) {
    return () => undefined
  }
  existing?.remove()
  delete window.umami

  const script = document.createElement('script')
  script.defer = true
  script.src = src
  script.setAttribute('data-website-id', options.websiteId)
  script.setAttribute(SCRIPT_ATTR, '1')
  if (options.domains) script.setAttribute('data-domains', options.domains)
  document.head.appendChild(script)

  return () => {
    script.remove()
  }
}

/** Honours data-track / data-track-target; otherwise logs http(s) outbound clicks. */
export function bindPulseClicks() {
  if (typeof document === 'undefined') return () => undefined

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0) return
    const node = event.target
    if (!(node instanceof Element)) return

    const tagged = node.closest<HTMLElement>('[data-track]')
    if (tagged?.dataset.track) {
      const target = tagged.dataset.trackTarget
      track(tagged.dataset.track, target ? { target } : undefined)
      return
    }

    const anchor = node.closest('a')
    if (!anchor?.href) return
    try {
      const url = new URL(anchor.href, window.location.href)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return
      if (url.origin === window.location.origin) return
      track('outbound_click', { target: url.hostname })
    } catch {
      /* ignore invalid href */
    }
  }

  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** post_view immediately; post_read at 50% or 30s; post_complete at 90%. */
export function bindPostEngagement(slug: string) {
  if (typeof window === 'undefined') return () => undefined

  track('post_view', { slug })
  let read = false
  let complete = false
  const started = Date.now()

  const tick = () => {
    const el = document.documentElement
    const max = el.scrollHeight - el.clientHeight
    const p = max <= 0 ? 1 : el.scrollTop / max
    if (!read && (p >= 0.5 || Date.now() - started >= 30_000)) {
      read = true
      track('post_read', { slug })
    }
    if (!complete && p >= 0.9) {
      complete = true
      track('post_complete', { slug })
    }
  }

  tick()
  window.addEventListener('scroll', tick, { passive: true })
  const timer = window.setTimeout(tick, 30_000)
  return () => {
    window.removeEventListener('scroll', tick)
    window.clearTimeout(timer)
  }
}
