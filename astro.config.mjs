import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://daninihub.com",
  output: "static",
  vite: { build: { assetsInlineLimit: 0 } },
  outDir: "./dist",
  trailingSlash: "always",
});
