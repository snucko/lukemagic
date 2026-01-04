# Codebase Cleanup Report

## Unused Components

### 1. **Gallery Component** (src/components/Gallery.astro)
- **Status**: UNUSED
- **Issue**: Component is defined but never imported or used anywhere in the codebase
- **Recommendation**: DELETE - The gallery functionality is implemented directly in `/gallery` page with inline code
- **Size Impact**: ~200 bytes

### 2. **SearchIndex** (src/components/SearchIndex.ts)
- **Status**: PARTIALLY UNUSED
- **Issue**: Imported in `search.json.ts` but the search index is never consumed by the frontend
- **Recommendation**: DELETE if no frontend search UI exists, or implement frontend search interface
- **Used by**: `search.json.ts` (generates `/api/search.json` endpoint)
- **Potential use**: Could be used for site-wide search feature if developed

---

## Unused Collections & Content

### 3. **Posts Collection** (src/content/posts/)
- **Status**: UNUSED
- **Files**: Only `welcome.md` exists
- **Used by**: 
  - `rss.xml.js` (generates RSS feed for posts that don't exist)
  - `search.json.ts` (indexes posts in search)
- **Issue**: Posts directory exists but no post pages are rendered. Post routes not defined.
- **Recommendation**: Either:
  - Remove posts collection entirely from config.ts, rss.xml.js, and search.json.ts
  - Or implement `/posts/[slug].astro` dynamic routing to render individual posts
- **Size Impact**: Minimal (1 file)

### 4. **Tricks Collection** (src/content/tricks/)
- **Status**: UNUSED
- **Files**: 11 trick files exist but no UI renders them
- **Used by**:
  - `search.json.ts` (indexes tricks in search)
  - Defined in `config.ts`
- **Issue**: 11 trick markdown files exist but there's no page to display them
- **Note**: This is separate from the "idea" collection which IS being used
- **Recommendation**: Either:
  - Delete the entire tricks collection if not needed
  - Implement `/tricks/[slug].astro` to render individual tricks
  - Merge with the "idea" collection which is actively used
- **Size Impact**: ~5KB

---

## Unused Features

### 5. **Breadcrumbs Component** (src/components/Breadcrumbs.astro)
- **Status**: USED BUT REDUNDANT
- **Used by**: about.astro, contact.astro, gallery.astro, shows/index.astro
- **Issue**: Breadcrumbs provide minimal navigational value on this site structure
- **Recommendation**: Keep if improving SEO is desired, otherwise remove from all pages to simplify UI
- **Size Impact**: Minor (~1KB)

### 6. **Seo Component** (src/components/Seo.astro)
- **Status**: ACTIVELY USED (Keep)
- **Used by**: Base layout
- **Assessment**: Properly utilized

---

## Unused/Unused Endpoints

### 7. **RSS Feed** (src/pages/rss.xml.js)
- **Status**: GENERATED BUT LIKELY UNUSED
- **Issue**: Generates RSS feed for posts, but there are no posts
- **Recommendation**: Keep as-is for future use, or remove if not needed

### 8. **Shows.ics** (src/pages/shows.ics.ts)
- **Status**: CHECK USAGE
- **Recommendation**: Verify if this calendar feed is being used/referenced anywhere

---

## Summary of Recommended Deletions

**Safe to Delete (definitely unused):**
1. `src/components/Gallery.astro` - Dead component
2. `src/components/SearchIndex.ts` - If no search UI planned
3. Entire `src/content/tricks/` folder - If merging with ideas
4. Remove tricks collection from `src/content/config.ts`
5. Remove tricks from `src/pages/search.json.ts`

**Consider Deleting (minimal value):**
6. Breadcrumbs from all pages (optional)
7. `src/content/posts/` collection (if not implementing blog)
8. Remove posts from `rss.xml.js` and `search.json.ts`

**Keep:**
- Seo component
- Inspirations component (actively used on homepage)
- All idea collection files and rendering

---

## Quick Cleanup Actions

### Action 1: Remove Unused Gallery Component
```bash
rm src/components/Gallery.astro
```

### Action 2: Remove Tricks Collection (if not needed)
```bash
rm -rf src/content/tricks/
```

### Action 3: Clean up config.ts
Remove these lines from `src/content/config.ts`:
```typescript
const tricks = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    durationMin: z.number().int().min(1).max(10),
    image: z.string().optional(),
  }),
});
```

And from exports:
```typescript
export const collections = { posts, shows, tricks, idea };
// Change to:
export const collections = { posts, shows, idea };
```

### Action 4: Clean up search.json.ts
Remove tricks from the search index if tricks collection is deleted.

### Action 5: Clean up posts (if not implementing blog)
```bash
rm -rf src/content/posts/
```

Update `rss.xml.js` to return empty feed or remove the file entirely.
