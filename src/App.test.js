import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// react-infinite-scroll-component needs scroll APIs jsdom lacks; the list itself is what we test
beforeEach(() => { window.location.hash = ''; window.scrollTo = jest.fn(); });

test('home route renders sample articles (previously "/" rendered nothing)', async () => {
  render(<App />);
  expect(await screen.findAllByText('Read More')).toHaveLength(9);
  expect(screen.getByRole('note')).toHaveTextContent('sample articles');
  expect(document.title).toBe('General - NewsHub');
});

test('navigating to a category updates heading and title', async () => {
  render(<App />);
  await screen.findAllByText('Read More');
  const nav = screen.getAllByRole('navigation')[0];
  userEvent.click(within(nav).getAllByText('Sports')[0]);
  await waitFor(() => expect(document.title).toBe('Sports - NewsHub'));
  expect(await screen.findAllByText('Read More')).toBeTruthy();
});

test('unknown routes fall back to home instead of a blank page', async () => {
  window.location.hash = '#/does-not-exist';
  render(<App />);
  expect(await screen.findAllByText('Read More')).toHaveLength(9);
});

test('article links open safely in a new tab', async () => {
  render(<App />);
  const links = await screen.findAllByText('Read More');
  expect(links[0]).toHaveAttribute('target', '_blank');
  expect(links[0]).toHaveAttribute('rel', expect.stringContaining('noopener'));
});
