import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base so the built site works on Netlify, Vercel and GitHub Pages (sub-path) alike.
  base: './',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 700 },
  resolve: { alias: { '@': `${import.meta.dirname}/src` } },
})
