// Build PNG OG images for tricks and posts using satori + resvg.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const OUT = "public/og";
fs.mkdirSync(OUT, { recursive: true });

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => path.join(dir, f));
}
function readFrontmatter(p) {
  const t = fs.readFileSync(p, "utf8");
  const m = t.match(/^---\n([\s\S]*?)\n---\n?/);
  const body = t.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const fm = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const mm = line.match(/^(\w+):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2].replace(/^"(.*)"$/,"$1").replace(/^'(.*)'$/,"$1");
    }
  }
  return { fm, body };
}
function slugFrom(p) { return path.basename(p, ".md"); }
const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";

function toSvg({ title, kicker = "Luke — Magic" }) {
  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0b0b0f" offset="0%"/>
      <stop stop-color="#12121a" offset="100%"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="#151520" stroke="#2a2a38"/>
  <text x="70" y="150" fill="#ffd166" font-size="36" font-family="${fontFamily}" letter-spacing="1"> ${kicker} </text>
  <foreignObject x="70" y="190" width="1060" height="340">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:${fontFamily}; color:white; font-size:72px; line-height:1.05; font-weight:800; ">
      ${(title || "Untitled").replace(/&/g,"&amp;").replace(/</g,"&lt;")}
    </div>
  </foreignObject>
  <text x="70" y="560" fill="#c5c5d0" font-size="28" font-family="${fontFamily}"> lukemagic.tivnan.org </text>
</svg>`;
}
function renderPng(svg, outPath) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png);
}

for (const p of listMd("src/content/tricks")) {
  const { fm } = readFrontmatter(p);
  const slug = slugFrom(p);
  const svg = toSvg({ title: fm.title || slug, kicker: "Trick" });
  renderPng(svg, path.join(OUT, `tricks/${slug}.png`));
}
for (const p of listMd("src/content/posts")) {
  const { fm } = readFrontmatter(p);
  const slug = slugFrom(p);
  const svg = toSvg({ title: fm.title || slug, kicker: "Update" });
  renderPng(svg, path.join(OUT, `posts/${slug}.png`));
}
console.log("OG images written to public/og/**");
