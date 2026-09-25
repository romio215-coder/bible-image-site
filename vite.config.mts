import { defineConfig } from "vite";
import vinext from "vinext";
import { mkdir, copyFile } from "node:fs/promises";

export default defineConfig(async () => {
  process.env.CLOUDFLARE_CF_FETCH_ENABLED = "false";
  process.env.WRANGLER_SEND_METRICS = "false";
  process.env.WRANGLER_WRITE_LOGS = "false";
  process.env.WRANGLER_LOG_PATH = ".wrangler/logs";
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    json: { stringify: true },
    plugins: [
      vinext(),
      cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] }, inspectorPort: false,
        config: { name: "wordlight-bible", main: "vinext/server/fetch-handler", compatibility_date: "2026-05-15", compatibility_flags: ["nodejs_compat"] } }),
      { name: "wordlight-hosting-manifest", async closeBundle() {
        await mkdir("dist/.openai", { recursive: true });
        await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
      } },
    ],
  };
});
