# Magic Trick Automation - Cloudflare Worker Setup

## Overview

This document describes the automated daily magic trick generation system that fetches tricks from `magic.tivnan.net` and commits them to the `snucko/lukemagic` GitHub repository.

## Problem Statement

The initial GitHub Actions workflow (`generate-trick.yml`) failed with HTTP 403 errors because `magic.tivnan.net` blocks GitHub Actions IP ranges at the Cloudflare firewall level. No amount of header spoofing or user-agent modification can bypass an IP-level block.

## Solution: Cloudflare Worker

Deploy a Cloudflare Worker that:
1. Fetches tricks using Cloudflare's IPs (not blocked)
2. Commits directly to GitHub via API
3. Runs on a scheduled cron trigger

## Architecture

```
[magic.tivnan.net]
         ↑
         │ (Cloudflare IP - not blocked)
         │
[trick-generator Worker @ cloudflare.com]
         │
         ↓ (GitHub API)
[snucko/lukemagic repo]
         │
         ↓
[Automated daily tricks in src/content/idea/]
```

## Deployment

### 1. Worker Code

Located at: `src/trick-worker.ts`

The worker has two modes:

**HTTP Handler** - Manual/on-demand trigger via HTTP request:
```bash
curl https://trick-generator.stivnan.workers.dev/
```

**Scheduled Handler** - Automatic daily trigger:
- Runs at 8 PM UTC daily (`0 20 * * *`)
- Fetches latest trick
- Commits to GitHub if new

### 2. Configuration

**Wrangler Config** (`trick-wrangler.toml`):
```toml
name = "trick-generator"
main = "src/trick-worker.ts"
compatibility_date = "2025-04-06"
compatibility_flags = ["nodejs_compat"]
workers_dev = true

[triggers]
crons = ["0 20 * * *"]
```

### 3. Secrets

The GitHub fine-grained personal access token is stored as a Cloudflare Worker secret:

```bash
npx wrangler secret put GITHUB_TOKEN --config trick-wrangler.toml
```

**Token Requirements:**
- Repository access: `snucko/lukemagic` only
- Permissions: `contents: write` (read and write access to code)
- Expiration: 90 days (regenerate before expiry)

### 4. Deployment Steps

```bash
# Deploy worker code
npx wrangler deploy --config trick-wrangler.toml

# Deploy triggers (cron schedule)
npx wrangler triggers deploy --config trick-wrangler.toml
```

## How It Works

### 1. Fetch Magic Trick

The worker requests `https://magic.tivnan.net/` and parses the HTML:

```javascript
// Extract trick name
const trickNameMatch = html.match(/Trick Name:\s*"?([^"<\n]+)"?/);

// Extract description from materials section
const materialsMatch = html.match(/Materials:<\/strong><br><br>([\s\S]*?)<br><br>/);
```

### 2. Deduplication Check

Before committing, the worker checks if the trick file already exists in the repo:

```javascript
const exists = await checkFileExists(fileName, githubToken);
if (exists) {
  return { status: 'skipped', trick: title, reason: 'Trick already exists' };
}
```

### 3. Create Markdown File

Generates a file with frontmatter:

```markdown
---
title: The Vanishing Quarter
description: A magic trick. A small coin
category: Magic
---

Trick of the day from https://magic.tivnan.net/
```

### 4. Commit to GitHub

Uses the GitHub REST API to:
1. Get latest commit SHA
2. Get parent tree SHA
3. Create blob with file content
4. Create tree with new blob
5. Create commit pointing to tree
6. Update main branch reference

**Key Headers:**
- `Authorization: Bearer ${GITHUB_TOKEN}`
- `Accept: application/vnd.github.v3+json`
- `User-Agent: trick-generator` (GitHub API requires this)

## Response Format

### Success
```json
{
  "status": "success",
  "trick": "The Vanishing Quarter",
  "filename": "the-vanishing-quarter.md",
  "commitSha": "ff8eda47067b9a5f2624c0c1d3950fb192ad7fed"
}
```

### Skipped (Already Exists)
```json
{
  "status": "skipped",
  "trick": "The Color Code",
  "reason": "Trick already exists"
}
```

### Error
```json
{
  "status": "error",
  "error": "Failed to fetch trick: HTTP 403"
}
```

## Testing

### Local Development

Test with local variables:

```bash
# Create .dev.vars with GitHub token
echo "GITHUB_TOKEN=$(gh auth token)" > .dev.vars

# Start local dev server
npx wrangler dev --config trick-wrangler.toml

# Test in another terminal
curl http://localhost:8787
```

### Production Testing

```bash
curl https://trick-generator.stivnan.workers.dev/
```

## Monitoring

### View Worker Logs

```bash
npx wrangler tail --config trick-wrangler.toml
```

### Check Cloudflare Dashboard

1. Go to **Workers & Pages**
2. Click **trick-generator**
3. View **Deployments**, **Triggers**, and **Logs** tabs

### Verify Commits

```bash
# Check recent trick commits
git log --oneline src/content/idea/ | head -10
```

## Troubleshooting

### HTTP 403 Errors

**Cause:** GitHub API requires `User-Agent` header

**Fix:** Ensure all GitHub API calls include:
```javascript
headers: {
  'User-Agent': 'trick-generator',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github.v3+json'
}
```

### Token Expiration

**Symptom:** Suddenly all requests fail with 401 Unauthorized

**Fix:** 
1. Generate new fine-grained token at https://github.com/settings/tokens?type=beta
2. Update secret: `npx wrangler secret put GITHUB_TOKEN --config trick-wrangler.toml`
3. Redeploy: `npx wrangler deploy --config trick-wrangler.toml`

### Cron Not Running

**Check:** Verify trigger is deployed:
```bash
npx wrangler triggers deploy --config trick-wrangler.toml
```

**View scheduled triggers:**
- Cloudflare Dashboard > Workers & Pages > trick-generator > Triggers tab

### No New Tricks Appearing

Possible causes:
1. **Token expired** - Check GitHub token expiration
2. **Trick already exists** - Check `src/content/idea/` for recent files
3. **magic.tivnan.net down** - Check site status manually
4. **Worker error** - Check logs via `wrangler tail`

## Differences from GitHub Actions

| Aspect | GitHub Actions | Cloudflare Worker |
|--------|---|---|
| Trigger | Workflow schedule or manual dispatch | Cron trigger or HTTP request |
| IP Block | ❌ Blocked by magic.tivnan.net firewall | ✅ Uses Cloudflare IPs |
| Cost | Free (GitHub included) | Free tier (100k req/day) |
| Logs | GitHub Actions UI | Cloudflare Dashboard / `wrangler tail` |
| Configuration | `.github/workflows/generate-trick.yml` | `trick-wrangler.toml` + `src/trick-worker.ts` |
| GitHub Auth | Repository token (repo scope) | Fine-grained PAT (contents:write only) |

## Files

- **Worker Code:** `src/trick-worker.ts`
- **Configuration:** `trick-wrangler.toml`
- **Local Dev Vars:** `.dev.vars` (git-ignored, contains GITHUB_TOKEN)
- **Output:** `luke-site/src/content/idea/` (committed tricks)

## Maintenance

### Regular Tasks

1. **Monthly:** Check GitHub token expiration date
   - https://github.com/settings/tokens?type=beta
   - Regenerate if expiring within 30 days

2. **Quarterly:** Review worker logs for errors
   - `wrangler tail --config trick-wrangler.toml`

3. **As Needed:** Update magic.tivnan.net parsing if site structure changes
   - HTML regex patterns in `fetchTrick()` function
   - Materials section format
   - Trick name extraction

### Regenerating GitHub Token

When token expires:

```bash
# 1. Generate new fine-grained token
#    - Repository: snucko/lukemagic
#    - Permissions: contents:write
#    - Copy immediately (shown only once)

# 2. Update Cloudflare secret
npx wrangler secret put GITHUB_TOKEN --config trick-wrangler.toml
# Paste new token when prompted

# 3. Redeploy
npx wrangler deploy --config trick-wrangler.toml
```

## References

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **GitHub REST API:** https://docs.github.com/en/rest
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **Magic Tricks Source:** https://magic.tivnan.net/
