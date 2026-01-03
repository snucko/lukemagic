# Daily Trick Automation

## Overview

Magic tricks are automatically fetched and pushed to this repository daily via a Cloudflare Worker. A new trick file appears in `src/content/idea/` every day.

## How It Works

1. **Fetching** - A Cloudflare Worker fetches the daily magic trick from `https://magic.tivnan.net/`
2. **Parsing** - The HTML is parsed to extract the trick name, materials, and instructions
3. **Push to GitHub** - The trick is automatically committed to this repository via GitHub API
4. **Deduplication** - Duplicate tricks are skipped to avoid redundant files

## File Structure

Each trick is stored as a markdown file in `src/content/idea/`:

```
src/content/idea/
├── ambitious-card.md
├── floating-petals.md
├── card-on-ceiling.md
└── ... (one per day)
```

### File Format

```markdown
---
title: Floating Petals
description: A magic trick. A delicate, artificial flower (12 inches long)
category: Magic
---

Trick of the day from https://magic.tivnan.net/
```

## Integration Details

The Cloudflare Worker follows the specification in `WORKER_INTEGRATION.md`:

- Fetches from magic.tivnan.net
- Parses trick name and description
- Checks for duplicates before committing
- Uses GitHub REST API to create commits
- Runs on a daily schedule

For worker implementation details, see: [`WORKER_INTEGRATION.md`](./WORKER_INTEGRATION.md)

## GitHub Integration

The worker commits directly to the `main` branch using the GitHub API:

1. Gets latest commit SHA
2. Creates a blob with the trick markdown
3. Creates a tree with the new blob
4. Creates a commit
5. Updates the main branch reference

No additional setup is needed in this repository - the worker handles everything.

## Monitoring

### Check Latest Tricks

List recently added tricks:
```bash
git log --oneline src/content/idea/ | head -10
```

### Manual Trigger

The worker can be manually triggered by the maintainer to generate a trick immediately.

## Troubleshooting

### No new tricks appearing

Check the Cloudflare Worker logs and status at:
```
https://cloudflare-sandbox.stivnan.workers.dev/
```

### Worker configuration

The worker requires:
- Valid GitHub token with `contents:write` permission for `snucko/lukemagic`
- Ability to reach both magic.tivnan.net and api.github.com

For detailed worker setup instructions, see the worker maintainer.
