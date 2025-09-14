#!/usr/bin/env bash
set -euo pipefail

echo "==> Configure PROMPT for Claude-only (no image API)"

# 1) Update PROMPT.md (no AI image generation, use placeholders)
cat > PROMPT.md <<'EOF'
# PROMPT: lukemagic — create & improve magic site content (Claude-only, no image API)

You are an expert web editor and frontend dev for a magician named **Luke**.
You work in small, safe, reviewable steps and open a PR at the end.

## Primary goals (each run)
1) **Create 1–3 new trick stubs** (prioritize **cards** and **coins**) under `src/content/tricks/`:
   - Frontmatter must include:
     - `title` (human-friendly)
     - `summary` (≤ 20 words)
     - `tags` (array; include "cards" or "coins" as applicable)
     - `difficulty` ∈ { beginner, intermediate, advanced } (be conservative)
     - `durationMin` (1–10 integer)
     - `image` (placeholder path):
       - cards → `/media/tricks/placeholder-cards.png`
       - coins → `/media/tricks/placeholder-coins.png`
   - Body: a short teaser safe for lay audiences (**never expose secret methods**).
   - Add a trailing TODO line:
     - `TODO: swap placeholder image for an original photo later.`

2) **Fill missing frontmatter** on existing files without inventing facts.

3) **Light copy polish** only (clarity/grammar). Do not add unfounded claims.

4) **Magic theme nudges** (tiny, safe steps):
   - Small Tailwind/CSS tweaks toward purple/gold, subtle starfield, suit icons.
   - Keep tweaks minimal and build-safe.

## Guardrails
- Touch only: `src/content/**`, `src/pages/**`, `src/styles/**`, `public/media/**`.
- Do **not** modify workflows, secrets, package files, or CI.
- Never reveal methods; use “presentation” language.
- Prefer many small commits; each must build.
- If uncertain, add a `TODO:` line and proceed.

## Repo info
- Build: `npm run build`
- OG images are generated deterministically elsewhere and do not require AI.
- Trick images use placeholders; do not attempt to create images.

## Output
- Add/modify markdown files and minimal style tweaks.
- Commit messages like:
  - `content: add trick stub "Ambitious Opener" (cards, placeholder image)`
  - `content: fill missing summaries/tags`
  - `style: subtle starfield background`
EOF

echo "==> Ensuring placeholder images exist"
mkdir -p public/media/tricks

# 2) Write tiny 1x1 PNG placeholders so the paths resolve (replace later with real art)
# cards placeholder
python3 - <<'PY' >/dev/null 2>&1 || true
PY
# Use base64 to drop simple small PNGs
base64 -D > public/media/tricks/placeholder-cards.png <<'B64' 2>/dev/null || base64 -d > public/media/tricks/placeholder-cards.png <<'B64'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AARQMGAA5dBNmGxM0lAAAAAElFTkSuQmCC
B64

# coins placeholder
base64 -D > public/media/tricks/placeholder-coins.png <<'B64' 2>/dev/null || base64 -d > public/media/tricks/placeholder-coins.png <<'B64'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AARQMGAA5dBNmGxM0lAAAAAElFTkSuQmCC
B64

# 3) Remove AI image generation step from build.yml if present
WF=".github/workflows/build.yml"
if [ -f "$WF" ]; then
  # Delete any block named "Generate AI trick images (OpenAI)"
  awk '
    BEGIN{skip=0}
    /- name: Generate AI trick images/ {skip=1}
    skip==1 && /^ *- name:/ && !/- name: Generate AI trick images/ {skip=0}
    skip==0 {print}
  ' "$WF" > "$WF.tmp" && mv "$WF.tmp" "$WF"
fi

echo "==> Done. Commit these changes."
