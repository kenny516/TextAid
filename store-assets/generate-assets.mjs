#!/usr/bin/env node
/**
 * TextAid store asset generator
 *
 * Generates all required PNG assets for store submissions:
 *   store-assets/promo-440x280.png    — Edge Add-ons small promo tile
 *   store-assets/promo-1400x560.png   — marquee banner (optional but recommended)
 *   store-assets/icon-300.png         — Edge logo (upscaled from icons/icon-textaid.png)
 *
 * Usage:
 *   npm run assets
 *
 * Requirements:
 *   npm install --save-dev sharp   (already added to package.json)
 */

import { createCanvas } from "canvas";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "store-assets");

/* ── Design tokens (matches extension dark theme) ─────────────── */
const BG = "#0a0a0a";
const FG = "#fafafa";
const MUTED = "rgba(250,250,250,0.45)";
const ACCENT = "#fafafa";
const BORDER = "rgba(255,255,255,0.08)";

function drawPromoTile(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines (decorative)
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 1;
    const step = Math.floor(width / 12);
    for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Central card
    const cw = Math.floor(width * 0.55);
    const ch = Math.floor(height * 0.55);
    const cx = Math.floor((width - cw) / 2);
    const cy = Math.floor((height - ch) / 2);
    const r = 12;

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    roundRect(ctx, cx, cy, cw, ch, r);
    ctx.fill();
    ctx.stroke();

    // Brand name
    const fontSize = Math.floor(height * 0.12);
    ctx.fillStyle = FG;
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TextAid", width / 2, height / 2 - fontSize * 0.15);

    // Tagline
    const tagSize = Math.floor(fontSize * 0.38);
    ctx.fillStyle = MUTED;
    ctx.font = `400 ${tagSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText("AI writing for every page", width / 2, height / 2 + fontSize * 0.6);

    return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

async function main() {
    // 440×280 promo tile
    const small = drawPromoTile(440, 280);
    writeFileSync(resolve(OUT, "promo-440x280.png"), small.toBuffer("image/png"));
    console.log("✓ store-assets/promo-440x280.png");

    // 1400×560 marquee tile
    const large = drawPromoTile(1400, 560);
    writeFileSync(resolve(OUT, "promo-1400x560.png"), large.toBuffer("image/png"));
    console.log("✓ store-assets/promo-1400x560.png");

    // 300×300 icon (upscale from icons/icon-textaid.png)
    const iconSrc = resolve(ROOT, "icons", "icon-textaid.png");
    await sharp(iconSrc)
        .resize(300, 300, { fit: "contain", background: { r: 10, g: 10, b: 10, alpha: 1 } })
        .png()
        .toFile(resolve(OUT, "icon-300.png"));
    console.log("✓ store-assets/icon-300.png");

    console.log("\nAll store assets generated in store-assets/");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
