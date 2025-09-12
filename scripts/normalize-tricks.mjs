import fs from "node:fs";
import path from "node:path";

const DIR = "src/content/tricks";
const DIFFICULTIES = new Set(["beginner","intermediate","advanced"]);

function parse(p) {
  const t = fs.readFileSync(p, "utf8");
  const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm:{}, body:t, had:false, raw:t };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].replace(/^"(.*)"$/,"$1").replace(/^'(.*)'$/,"$1");
  }
  return { fm, body:m[2], had:true, raw:t };
}
function emit(fm, body) {
  const keys = Object.keys(fm);
  return `---\n${keys.map(k => `${k}: ${JSON.stringify(fm[k])}`).join("\n")}\n---\n${body}`;
}

let changed = 0;
if (fs.existsSync(DIR)) {
  for (const f of fs.readdirSync(DIR).filter(f=>f.endsWith(".md"))) {
    const p = path.join(DIR, f);
    const { fm, body } = parse(p);
    let c = false;

    if (!fm.difficulty || !DIFFICULTIES.has(String(fm.difficulty).toLowerCase())) {
      fm.difficulty = "intermediate"; c = true;
    }
    if (!fm.durationMin || isNaN(Number(fm.durationMin))) {
      fm.durationMin = 4; c = true;
    } else {
      fm.durationMin = Math.max(1, Math.round(Number(fm.durationMin)));
    }

    if (c) { fs.writeFileSync(p, emit(fm, body)); changed++; }
  }
}
console.log(`Normalized ${changed} trick file(s).`);
