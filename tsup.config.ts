import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.tsx',
    events: 'src/events.ts',
    sites: 'src/sites.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react'],
})
