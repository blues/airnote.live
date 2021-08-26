import { format } from 'date-fns';
import { fireEvent, render, waitFor } from '@testing-library/svelte';

import Dashboard from '../../../src/routes/Dashboard/Dashboard.svelte';
import { NO_DATA_ERROR_HEADING, FETCH_ERROR_HEADING } from '../../../src/constants';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('If there’s an error getting readings the user should see an error', async () => {
  fetch.mockImplementationOnce(() => Promise.reject());
  const { getByText, queryByText } = render(Dashboard, {
    deviceUID: '...'
  });

  let errorHeading = await waitFor(() => getByText(FETCH_ERROR_HEADING));
  expect(errorHeading).toBeInTheDocument();

  // Do NOT show the no data error
  errorHeading = queryByText(NO_DATA_ERROR_HEADING);
  expect(errorHeading).toBe(null);
});

test('If the API returns no data the user should see a no-data error', async () => {
  fetch.mockImplementationOnce(() => Promise.resolve({
    json: () => Promise.resolve({
      hits: { hits: [] }
    })
  }));
  const { getByText, queryByText } = render(Dashboard, {
    deviceUID: '...'
  });

  let errorHeading = await waitFor(() => getByText(NO_DATA_ERROR_HEADING));
  expect(errorHeading).toBeInTheDocument();

  // Do NOT show the fetch error
  errorHeading = queryByText(FETCH_ERROR_HEADING);
  expect(errorHeading).toBe(null);
});

test('If the API returns data show no errors', async () => {
  fetch.mockImplementationOnce(() => Promise.resolve({
    json: () => Promise.resolve({
      hits: { hits: [{}] }
    })
  }));
  const { getByText, queryByText } = render(Dashboard, {
    deviceUID: '...'
  });

  await waitFor(() => getByText('Air Quality'));

  expect(queryByText(FETCH_ERROR_HEADING)).toBe(null);
  expect(queryByText(NO_DATA_ERROR_HEADING)).toBe(null);
});
