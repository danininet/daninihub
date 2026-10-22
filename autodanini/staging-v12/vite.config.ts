import { defineConfig } from 'vite';
import { resolve } from 'node:path';
const pages = ["index","buyers","dealers","live","inspection","import","exclusive","tender","auctions","guides","about","contact","impressum","privacy","terms","cookies","ai-advisor","disclaimer","cenovnik","ai-primer","faq","nalog","admin"];

export default defineConfig({
  // Hostinger staging uses an isolated adapter, preserving the AppDeploy v12
  // HTML/CSS/JS design and keeping unsupported account flows fail-closed.
  resolve: process.env.AUTODANINI_BUILD_TARGET === 'hostinger'
    ? { alias: { '@appdeploy/client': resolve(process.cwd(), 'src/hostinger-client.ts') } }
    : {},
  base: './',
  build: {
    outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist',
    sourcemap:
      process.env.APPDEPLOY_VITE_SOURCEMAP === 'hidden' ? 'hidden' : false,
    rollupOptions: {
      maxParallelFileOps: 128,
      input: Object.fromEntries(pages.map(name => [name, resolve(process.cwd(), name + '.html')])), 
    },
  },
});
