import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/src/lib/site';

const aiSearchCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended'
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: aiSearchCrawlers, allow: '/' },
      { userAgent: '*', allow: '/' }
    ],
    sitemap: absoluteUrl('/sitemap.xml')
  };
}
