import { render } from "@testing-library/svelte";
import Dashboard from "../../../src/routes/Dashboard/Dashboard.svelte";
import { ERROR_TYPE } from "../../../src/constants/ErrorTypes";

beforeEach(() => {
  fetch.mockClear();
});

const FETCH_ERROR_HEADING_TEXT = "Unable to fetch device details.";

test("If there’s an error getting readings the user should see an error", async () => {
  fetch.mockImplementation(() => Promise.reject());
  const { findByText, queryByText } = render(Dashboard, {
    deviceUID: "...",
  });

  let errorHeading = await findByText(FETCH_ERROR_HEADING_TEXT);
  expect(errorHeading).toBeInTheDocument();

  // Do NOT show the no data error
  errorHeading = queryByText(ERROR_TYPE.NO_DATA_ERROR);
  expect(errorHeading).toBe(null);
});

test("If the API returns no data the user should see a no-data error", async () => {
  fetch.mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
  const { findByText, queryByText } = render(Dashboard, {
    deviceUID: "...",
  });

  let errorHeading = await findByText(ERROR_TYPE.NO_DATA_ERROR);
  expect(errorHeading).toBeInTheDocument();

  // Do NOT show the fetch error
  errorHeading = queryByText(FETCH_ERROR_HEADING_TEXT);
  expect(errorHeading).toBe(null);
});

/*
TODO: Figure out how to mock the speedometer. Currently it throws errors
because Jest can’t transform the 3rd-party speedometer’s plugin
appropriately.
*/
// test("If the API returns data show no errors", async () => {
//   fetch.mockImplementationOnce(() =>
//     Promise.resolve({
//       json: () =>
//         Promise.resolve([
//           {
//             body: {
//               aqi: 10,
//               pm02_5: 5,
//             },
//             captured: "2021-01-01T10:01:01Z",
//           },
//         ]),
//     })
//   );
//   const { getByText, queryByText } = render(Dashboard, {
//     deviceUID: "...",
//   });

//   await waitFor(() => getByText("Air Quality"));

//   expect(queryByText(FETCH_ERROR_HEADING_TEXT)).toBe(null);
//   expect(queryByText(ERROR_TYPE.NO_DATA_ERROR)).toBe(null);
// });
