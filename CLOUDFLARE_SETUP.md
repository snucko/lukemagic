# Cloudflare Worker Setup

This Worker fetches magic tricks and commits them to GitHub directly, bypassing the 403 block.

## Prerequisites

- Cloudflare account with Workers enabled
- GitHub Personal Access Token
- `wrangler` CLI installed (`npm install -g wrangler`)

## Setup Steps

### 1. Create GitHub Token

- Go to https://github.com/settings/tokens?type=beta
- Click "Generate new token"
- Name: "Cloudflare Trick Generator"
- Select repo: `snucko/lukemagic`
- Permissions needed:
  - `contents: write` (to commit files)
- Click "Generate token"
- **Copy the token** (you'll only see it once)

### 2. Deploy Worker

```bash
# Install wrangler if not already done
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set the GitHub token as a secret
wrangler secret put GITHUB_TOKEN --env production

# Deploy the worker
wrangler deploy --env production
```

### 3. Set Up Scheduled Trigger (Daily)

In Cloudflare Dashboard:
1. Go to Workers & Pages → Your Worker
2. Click "Triggers" tab
3. Under "Cron Triggers", click "Add cron trigger"
4. Enter: `0 0 * * *` (runs daily at midnight UTC)
5. Save

### 4. Test It

**Via Cloudflare Dashboard:**
- Go to your Worker page
- Click "Invoke" button

**Via curl:**
```bash
curl "https://your-worker-url/?trigger=true" -X GET
```

**Via webhook:**
```bash
curl -X POST https://your-worker-url/
```

## How It Works

1. Worker fetches from `https://magic.tivnan.net/` (not blocked by Cloudflare IPs)
2. Parses the HTML for trick name and description
3. Checks if file already exists in GitHub
4. If new, creates blob, tree, commit via GitHub API
5. Updates the `main` branch reference
6. Runs on schedule (0 0 * * * = 00:00 UTC daily)

## Troubleshooting

**403 errors still occurring:**
- Verify GITHUB_TOKEN is set correctly in Worker secrets
- Check token has `contents: write` permission for the repo
- Confirm token is not expired

**Trick not appearing:**
- Check Worker logs in Cloudflare Dashboard
- Verify cron trigger is enabled
- Manually invoke with `?trigger=true` to test

**Check Worker Logs:**
```bash
wrangler tail --env production
```

## Alternative: Use GitHub Workflow + Worker

If you want to keep the scheduled workflow but use the Worker for data:
- Modify `generate-idea.mjs` to call your Worker endpoint
- Worker returns trick data as JSON
- Workflow commits locally

Let me know if you want this approach instead.
