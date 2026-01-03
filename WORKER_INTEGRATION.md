# Cloudflare Worker Integration Guide

Instructions for your Cloudflare Worker to automatically add magic tricks to this repository.

## Repository Structure

```
lukemagic/
├── src/
│   └── content/
│       └── idea/          ← Trick files go here
│           ├── trick-1.md
│           ├── trick-2.md
│           └── ...
├── package.json
└── ...
```

## What Your Worker Should Do

### 1. Fetch the Trick

Request `https://magic.tivnan.net/` and parse the HTML:

```javascript
const html = await fetch('https://magic.tivnan.net/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(r => r.text());
```

### 2. Extract Trick Data

Parse these fields from the HTML:

**Trick Name:**
```regex
Trick Name:\s*"?([^"<\n]+)"?
```

**Description (optional):**
```regex
Materials:<\/strong><br><br>([\s\S]*?)<br><br>
```

Extract the first material item for a 1-2 sentence description.

### 3. Check if Trick Exists

Before creating, check if the file already exists:

```
GET /repos/snucko/lukemagic/contents/src/content/idea/{filename}.md
```

If it returns 200, skip this trick (already exists).

### 4. File Naming

Convert trick title to filename:
- Lowercase
- Replace spaces with hyphens
- Add `.md` extension

Example: `"Hidden Harmony"` → `hidden-harmony.md`

### 5. File Content Format

Create a file at `src/content/idea/{filename}.md` with this exact format:

```markdown
---
title: Trick Name Here
description: One or two sentence description of the trick
category: Magic
---

Trick of the day from https://magic.tivnan.net/
```

**Example:**
```markdown
---
title: Hidden Harmony
description: A magic trick. A small, blank piece of paper (6 inches x 4 inches)
category: Magic
---

Trick of the day from https://magic.tivnan.net/
```

### 6. Commit to GitHub

Use GitHub API to commit the file:

**Required headers:**
```json
{
  "Authorization": "Bearer YOUR_GITHUB_TOKEN",
  "Accept": "application/vnd.github.v3+json"
}
```

**Steps:**
1. Get latest commit SHA from `main` branch
2. Create a blob with the file content
3. Create a tree with the new blob
4. Create a commit pointing to the tree
5. Update the `main` branch reference to the new commit

**API Endpoints:**

Get latest commit:
```
GET /repos/snucko/lukemagic/commits?sha=main&per_page=1
```

Create blob:
```
POST /repos/snucko/lukemagic/git/blobs
Body: { "content": "...", "encoding": "utf-8" }
```

Create tree:
```
POST /repos/snucko/lukemagic/git/trees
Body: {
  "base_tree": "parent_tree_sha",
  "tree": [{
    "path": "src/content/idea/filename.md",
    "mode": "100644",
    "type": "blob",
    "sha": "blob_sha"
  }]
}
```

Create commit:
```
POST /repos/snucko/lukemagic/git/commits
Body: {
  "message": "chore: generate new trick idea",
  "tree": "tree_sha",
  "parents": ["parent_commit_sha"],
  "author": {
    "name": "github-actions[bot]",
    "email": "github-actions[bot]@users.noreply.github.com"
  }
}
```

Update branch:
```
PATCH /repos/snucko/lukemagic/git/refs/heads/main
Body: { "sha": "new_commit_sha" }
```

## Response Format

Return JSON indicating success or failure:

**Success:**
```json
{
  "status": "success",
  "trick": "Trick Name",
  "filename": "trick-name.md",
  "commitSha": "abc123..."
}
```

**Skipped (already exists):**
```json
{
  "status": "skipped",
  "trick": "Trick Name",
  "reason": "Trick already exists"
}
```

**Error:**
```json
{
  "status": "error",
  "error": "Error message here"
}
```

## Validation Checklist

Before committing, your worker should:

- [ ] Successfully fetched HTML from magic.tivnan.net
- [ ] Found and extracted trick name
- [ ] Trick name is not empty after cleanup
- [ ] File does not already exist in repo
- [ ] File content is valid markdown
- [ ] GitHub token is valid and has `contents: write` permission
- [ ] Successfully created blob, tree, and commit

## Notes

- **GitHub Token**: Must have `contents: write` permission for this repo
- **Automation**: Can run on schedule (daily recommended) or on-demand
- **Duplicate Prevention**: File existence check prevents duplicate tricks
- **Commit Author**: Use `github-actions[bot]` for consistency

## Example Workflow

```
1. Fetch magic.tivnan.net
2. Parse trick name "New Trick"
3. Check if new-trick.md exists
4. If not exists:
   - Create markdown content
   - Commit to GitHub main branch
   - Return success with commit SHA
5. If exists:
   - Return skipped status
```
