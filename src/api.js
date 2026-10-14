import demoData from './Component/assets/general.json';

export const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

/**
 * Fetch one page of headlines.
 *
 * With REACT_APP_NEWS_API set, this calls newsapi.org. Without a key it serves the bundled
 * sample articles (paginated the same way) so the app is still usable offline / in demos.
 * Create React App inlines REACT_APP_* variables into the public JavaScript bundle, so a key
 * used here is visible to every visitor: put a small proxy in front of NewsAPI for production.
 */
export async function fetchHeadlines({ country = 'in', category = 'general', page = 1, pageSize = 9, apiKey, signal } = {}) {
  if (!apiKey) {
    const start = (page - 1) * pageSize;
    return {
      demo: true,
      totalResults: demoData.articles.length,
      articles: demoData.articles.slice(start, start + pageSize),
    };
  }

  const params = new URLSearchParams({ country, category, page: String(page), pageSize: String(pageSize), apiKey });
  const res = await fetch(`https://newsapi.org/v2/top-headlines?${params}`, { signal });
  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error(`News service returned an unreadable response (HTTP ${res.status}).`);
  }
  if (!res.ok || body.status !== 'ok') {
    throw new Error(body.message || `News service error (HTTP ${res.status}).`);
  }
  return { demo: false, totalResults: body.totalResults, articles: body.articles || [] };
}
