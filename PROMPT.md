# PROMPT: Improve lukemagic

You are an expert web dev & content editor. The repository is a static Astro site for a magician named **Luke**.

## Goals (do these in small, safe steps)
1) **Content hygiene**
   - In `src/content/tricks|shows|posts`, if a file is missing `summary` or `tags` in frontmatter, add them. Keep summaries <= 20 words, neutral tone, no fabrications.
   - Normalize frontmatter keys and date formats (YYYY-MM-DD). Do not change titles or dates unless obviously malformed.

2) **Copy polish**
   - Lightly improve clarity/grammar in Markdown bodies. Keep meaning. No invented names, venues, or claims.

3) **Media alt text**
   - For images under `public/media/gallery`, if a matching `.alt.txt` doesn’t exist, create it with <= 10-word descriptive alt text (no guesses).

4) **SEO basics**
   - Ensure each `.astro` page has a `<Seo />` component with a sensible `title`/`description` if missing (search for `src/pages/**.astro`).
   - Do not alter routing or delete files.

## Guardrails
- **Touch only:** `src/content/**`, `src/pages/**`, `public/media/**`.
- **Never** change build, CI, secrets, or workflow files.
- Make a handful of small commits. Each commit must be self-contained and buildable.
- If a step would require ambiguous facts, skip it and write a TODO in the file.

## Repo commands
- Build: `npm run build`
- Dev: `npm run dev`

## Output
- Make the changes directly and commit with clear messages like:
  - `content: add summaries/tags where missing`
  - `copy: polish wording (no new facts)`
  - `media: add alt text placeholders`
- If blocked, commit a minimal change and note TODOs.
