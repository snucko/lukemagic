/**
 * Cloudflare Worker for Analytics Engine
 * Deploy to Cloudflare Workers for your domain
 * 
 * This worker:
 * - Intercepts analytics tracking requests
 * - Logs events to Cloudflare Analytics Engine
 * - Allows indefinite data retention (free tier)
 */

interface AnalyticsEvent {
  event: string;
  page: string;
  referrer: string;
  timestamp: string;
  method?: string;
  status?: number;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle analytics tracking requests
    if (url.pathname === '/__analytics_engine__/track') {
      if (request.method === 'POST') {
        try {
          const formData = await request.formData();
          const event: AnalyticsEvent = {
            event: formData.get('event') as string || 'unknown',
            page: formData.get('page') as string || '',
            referrer: formData.get('referrer') as string || '',
            timestamp: formData.get('timestamp') as string || new Date().toISOString(),
          };

          // Write to Analytics Engine
          if (env.ANALYTICS_ENGINE_BINDING) {
            await env.ANALYTICS_ENGINE_BINDING.writeDataPoint({
              indexes: [event.event, event.page],
              blobs: [event.referrer, event.timestamp],
              doubles: [1],
            });
          }

          return new Response(JSON.stringify({ status: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Analytics error:', error);
          return new Response(JSON.stringify({ status: 'error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // Pass through all other requests to the origin
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
