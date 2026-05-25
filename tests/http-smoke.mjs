import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";

const port = 3312;
const baseUrl = `http://127.0.0.1:${port}`;

const routes = [
  "/",
  "/sitemap.xml",
  "/robots.txt",
  "/image-size/",
  "/image-size/aspect-ratio-calculator/",
  "/image-size/print-size-calculator/",
  "/image-size/dpi-calculator/",
  "/image-size/youtube-banner-safe-area/",
  "/image-size/social-media-image-size-calculator/",
  "/image-size/google-play-app-icon-size/",
  "/image-size/advanced-safe-zone-database/"
];

function requestPath(route) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${route}`, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({ route, status: res.statusCode || 0, body });
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error(`Timeout while requesting ${route}`));
    });
  });
}

async function waitForServer(timeoutMs = 60000) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const result = await requestPath("/");
      if (result.status >= 200 && result.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw lastError || new Error("Server did not become ready");
}

const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
if (!fs.existsSync(nextCli)) {
  throw new Error(`Next CLI not found: ${nextCli}`);
}

const server = spawn(process.execPath, [nextCli, "start", "-p", String(port)], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
  windowsHide: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1"
  }
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

server.on("error", (error) => {
  console.error(serverOutput);
  console.error(error);
  process.exit(1);
});

try {
  await waitForServer();

  for (const route of routes) {
    const result = await requestPath(route);
    if (result.status !== 200) {
      throw new Error(`${route} returned HTTP ${result.status}`);
    }
    if (route.startsWith("/image-size/") && !/Image|PixelFit|DPI|Safe|Calculator|Tool|Size/i.test(result.body)) {
      throw new Error(`${route} did not return expected tool content`);
    }
    console.log(`PASS ${route}`);
  }

  console.log("HTTP smoke tests passed.");
} finally {
  server.kill("SIGTERM");
}
