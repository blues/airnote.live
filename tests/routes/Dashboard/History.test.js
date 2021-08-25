import { format } from 'date-fns';
import { fireEvent, render } from '@testing-library/svelte';

import History from '../../../src/routes/Dashboard/History.svelte';
import { DATE_FORMAT_KEY } from '../../../src/constants';

test('Ensure changing the filter updates the title', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateKey = format(yesterday, DATE_FORMAT_KEY);

  const { getByRole, getByText } = render(History, {
    data: {
      aqi: {
        dateKey: 10
      },
      pm2_5: {
        dateKey: 10
      },
      pm10_0: {},
    }
  });

  const button = getByText('PM2.5');
  await fireEvent.click(button);

  expect(getByRole('heading').innerHTML).toContain('PM2.5');
});