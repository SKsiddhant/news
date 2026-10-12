import { fetchHeadlines } from './api';

afterEach(() => { delete global.fetch; });

test('without a key it serves paginated sample data and never calls fetch', async () => {
  global.fetch = jest.fn();
  const p1 = await fetchHeadlines({ page: 1, pageSize: 9 });
  const p3 = await fetchHeadlines({ page: 3, pageSize: 9 });
  expect(p1.demo).toBe(true);
  expect(p1.articles).toHaveLength(9);
  expect(p1.totalResults).toBe(20);
  expect(p3.articles).toHaveLength(2);           // 20 = 9 + 9 + 2, then it stops
  expect(global.fetch).not.toHaveBeenCalled();
});

test('with a key it calls NewsAPI with the requested category and page', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200,
    json: async () => ({ status: 'ok', totalResults: 1, articles: [{ url: 'https://x', title: 'T' }] }),
  });
  const out = await fetchHeadlines({ category: 'sports', page: 2, pageSize: 5, apiKey: 'k' });
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.origin + url.pathname).toBe('https://newsapi.org/v2/top-headlines');
  expect(url.searchParams.get('category')).toBe('sports');
  expect(url.searchParams.get('page')).toBe('2');
  expect(out).toMatchObject({ demo: false, totalResults: 1 });
});

test('API errors surface the service message instead of a blank page', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false, status: 426,
    json: async () => ({ status: 'error', message: 'Developer accounts are limited to localhost.' }),
  });
  await expect(fetchHeadlines({ apiKey: 'k' })).rejects.toThrow('limited to localhost');
});

test('an unreadable response becomes a clear error', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 502, json: async () => { throw new Error('bad'); } });
  await expect(fetchHeadlines({ apiKey: 'k' })).rejects.toThrow('HTTP 502');
});
