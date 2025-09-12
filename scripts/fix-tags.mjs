import fs from "node:fs";
import path from "node:path";

const ROOT = "src/content";
function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap(name => {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) return listMd(p);
    return p.endsWith(".md") ? [p] : [];
  });
}

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const rawFM = m[1], body = m[2];
  const fm = {};
  for (const line of rawFM.split("\n")) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2];
  }
  return { fm, body, rawFM };
}

function buildFM(fm) {
  const lines = [];
  for (const [k,v] of Object.entries(fm)) {
    if (k === "tags" && Array.isArray(v)) {
      lines.push(`${k}: [${v.map(s=>JSON.stringify(s)).join(", ")}]`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  return `---\n${lines.join("\n")}\n---\n`;
}

let changed = 0;
for (const p of listMd(ROOT)) {
  const src = fs.readFileSync(p,"utf8");
  const parsed = parse(src);
  if (!parsed) continue;

  let { fm, body } = parsed;
  // If tags is a quoted string or comma-separated, coerce to array
  if (fm.tags && !/^\s*\[/.test(fm.tags)) {
    let val = fm.tags.replace(/^["']|["']$/g,"").trim();
    const arr = val.includes(",") ? val.split(",").map(s=>s.trim()).filter(Boolean)
                                  : val ? [val] : [];
    fm.tags = arr;
    const out = buildFM(fm) + body;
    if (out !== src) {
      fs.writeFileSync(p, out);
      changed++;
      console.log(`Fixed tags -> array: ${p}`);
    }
  }
}
console.log(`Done. Files updated: ${changed}`);
