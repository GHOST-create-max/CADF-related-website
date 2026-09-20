// Shared headless-browser helper for the CADF site.
// Uses the locally-extracted Chromium (no CDN access in this sandbox).
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const CHROME_DIR = path.join(ROOT, '..', '.cache', 'chrome');
const EXECUTABLE = path.join(CHROME_DIR, 'chromium');

process.env.LD_LIBRARY_PATH = [
  path.join(CHROME_DIR, 'lib', 'lib'),
  path.join(CHROME_DIR, 'swiftshader'),
  process.env.LD_LIBRARY_PATH || '',
].filter(Boolean).join(':');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--disable-gpu-compositing',
  '--disable-software-rasterizer',
  '--disable-vulkan',
  '--use-angle=none',
  '--use-gl=disabled',
  '--in-process-gpu',
  '--hide-scrollbars',
  '--font-render-hinting=none',
];

async function launch() {
  return chromium.launch({
    executablePath: EXECUTABLE,
    headless: true,
    args: LAUNCH_ARGS,
  });
}

module.exports = { launch, BASE_URL, EXECUTABLE };
