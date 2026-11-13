import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://daninihub.com",
  output: "static",
  outDir: "./dist",
  trailingSlash: "always",
});
