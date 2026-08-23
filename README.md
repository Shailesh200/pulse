# Pulse

Self-hosted analytics for every app. Dashboard: **https://pulse.shaileshjha.in**

This repo is the platform (Umami on Coolify) plus **`@shailesh200/pulse-tracker`** on GitHub Packages. Umami is the UI.

A visitor on `shaileshjha.in` never hits this git repo. The browser loads `https://pulse.shaileshjha.in/script.js`. Each product installs the tracker and calls `track()` at real click/read sites.

## How apps consume this

Private package. Do not use `file:../pulse`. Do not use a git submodule.

Local (once, this machine already has it): `~/.npmrc`

```
@shailesh200:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PAT
```

Each app:

```bash
npm i @shailesh200/pulse-tracker
```

```ts
import { Pulse } from '@shailesh200/pulse-tracker/react'
import { track, trackProps, portfolioEvents } from '@shailesh200/pulse-tracker'

<Pulse websiteId={import.meta.env.VITE_PUBLIC_PULSE_WEBSITE_ID} />
<a href="/work" {...trackProps(portfolioEvents.ctaClick, 'work')}>Work</a>
```

SPA: do not also `track()` on every route. Umami already watches History. No emails in properties. ChessSchool: `identify(userId)` only.

Vercel: add env `NPM_TOKEN` (same PAT, `read:packages`) on the project. Website ids stay in app env, not in Vercel as the package name.

Publish (from this repo, after `npm run build`):

```bash
npm publish
```

## Ship order

1. Namecheap A record: host `pulse` → `167.233.223.123` (done)
2. Coolify Umami at `https://pulse.shaileshjha.in` (done)
3. Change `admin` / `umami`. Volume backups. No auth in front of `/script.js` or `/api/send` (done)
4. Publish `@shailesh200/pulse-tracker` to GitHub Packages
5. Website ids in `src/sites.ts` (Portfolio + Writes done)
6. In each app, after that app’s other work (portfolio SEO first): `npm i @shailesh200/pulse-tracker`

`docker-compose.yml` is local/emergency only. Do not run it on the VPS next to Coolify’s Umami.
