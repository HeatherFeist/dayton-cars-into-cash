import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitePlugin } from './scripts/sitePlugin.mjs'

export default defineConfig({
  plugins: [react(), sitePlugin()],
})
