# Cloudflare Analytics Engine Setup

## Overview

This site now uses **Cloudflare Analytics Engine** for tracking page views. Benefits:

- ✅ **Free tier** with unlimited retention (vs Plausible's 30-day limit)
- ✅ Integrated with Cloudflare Pages/Workers
- ✅ Privacy-friendly (first-party analytics)
- ✅ SQL-queryable data
- ✅ No external dependencies

## How It Works

1. **Client-side tracking** (`src/layouts/Base.astro`):
   - Tracks pageviews automatically on all pages
   - Sends data to `/__analytics_engine__/track` endpoint
   - Uses `navigator.sendBeacon()` for non-blocking requests

2. **Worker endpoint** (`src/worker-analytics.ts`):
   - Receives analytics requests
   - Logs to Cloudflare Analytics Engine
   - Supports custom events and metadata

## Setup Instructions

### Step 1: Deploy Worker to Cloudflare

Option A - Using Wrangler CLI:
```bash
wrangler publish src/worker-analytics.ts --name luke-analytics
```

Option B - Deploy via Cloudflare Dashboard:
1. Go to Workers → Create Service
2. Copy code from `src/worker-analytics.ts`
3. Name: `luke-analytics`
4. Deploy

### Step 2: Bind Analytics Engine

In `wrangler.toml`:
```toml
[[env.production.routes]]
pattern = "lukemagic.tivnan.org/__analytics_engine__/*"
zone_id = "YOUR_ZONE_ID"

[[env.production.analytics_engine_datasets]]
binding = "ANALYTICS_ENGINE_BINDING"
```

### Step 3: Enable in Cloudflare Dashboard

1. Go to **Workers & Pages** → **Routes**
2. Add route: `lukemagic.tivnan.org/__analytics_engine__/*` → `luke-analytics` worker
3. Deploy

## Querying Analytics

### Via Cloudflare Dashboard

1. Workers & Pages → **Analytics Engine**
2. Run SQL queries on your data

### Example Queries

**Page views by page:**
```sql
SELECT indexes[1] as page, COUNT(*) as views
FROM analytics
WHERE indexes[0] = 'pageview'
GROUP BY indexes[1]
ORDER BY views DESC
```

**Traffic by date:**
```sql
SELECT DATE(CAST(blobs[1] AS TIMESTAMP)) as date, COUNT(*) as views
FROM analytics
WHERE indexes[0] = 'pageview'
GROUP BY DATE(CAST(blobs[1] AS TIMESTAMP))
ORDER BY date DESC
```

**Referrer sources:**
```sql
SELECT blobs[0] as referrer, COUNT(*) as count
FROM analytics
WHERE indexes[0] = 'pageview' AND blobs[0] != ''
GROUP BY referrer
ORDER BY count DESC
```

## Data Structure

Each event logged to Analytics Engine contains:

```javascript
{
  indexes: [event, page],           // Searchable strings
  blobs: [referrer, timestamp],     // Text data
  doubles: [1],                     // Numeric data (count)
}
```

**Example:**
```javascript
{
  indexes: ['pageview', '/ideas/'],
  blobs: ['https://google.com', '2024-04-08T20:00:00Z'],
  doubles: [1],
}
```

## Tracking Events

The system currently tracks:
- **pageview**: Page visits with referrer and timestamp

To add custom events, modify `src/layouts/Base.astro`:

```javascript
// Track custom event
const trackEvent = (eventName, metadata = {}) => {
  const data = new FormData();
  data.append('event', eventName);
  data.append('page', window.location.pathname);
  data.append('metadata', JSON.stringify(metadata));
  data.append('timestamp', new Date().toISOString());
  navigator.sendBeacon('/__analytics_engine__/track', data);
};

// Example: Track button clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('button_click', { text: btn.textContent });
  });
});
```

## Retention & Costs

- **Free tier**: Up to 2M events/day
- **Retention**: Indefinite (with SQL export for backups)
- **Cost**: $0 (included in Cloudflare Workers free tier)

For higher volumes, paid tier starts at $5.50/month.

## Troubleshooting

**Events not appearing?**

1. Check Worker is deployed:
   ```bash
   wrangler tail luke-analytics
   ```

2. Check browser console for errors
3. Verify route is configured in Cloudflare dashboard
4. Check CORS headers if needed

**Can't query data?**

1. Wait 5-10 minutes for first data to appear
2. Verify Analytics Engine dataset exists in dashboard
3. Check you're using correct binding name in queries

## Migration from Plausible

- Historical Plausible data: Export from Plausible dashboard before switching
- New data: Automatically collected once Worker is deployed
- No data overlap or loss of current tracking

## References

- [Cloudflare Analytics Engine Docs](https://developers.cloudflare.com/analytics-engine/)
- [Workers Bindings](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [SQL Query Reference](https://developers.cloudflare.com/analytics-engine/sql-reference/)
