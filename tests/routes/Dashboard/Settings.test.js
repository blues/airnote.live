import { render, screen, fireEvent } from "@testing-library/svelte";

import Settings from "../../../src/routes/Settings/Settings.svelte";

beforeEach(() => {
  fetch.mockClear();
});

const FETCH_ERROR_HEADING_TEXT = "Unable to fetch device details.";
const NO_PIN_INVALID_PIN = "No PIN or invalid PIN detected.";
const UNABLE_TO_SAVE_SETTINGS = "Unable to save new configuration settings.";

test("If there is an error fetching device settings data, the user should see an appropriate error message", async () => {
  fetch.mockImplementation(() => Promise.reject());

  const { findByText } = render(Settings, {
    deviceUID: "dev.testAirnote",
    productUID: "faux.airnote",
    pin: 1234,
  });

  let errorHeading = await findByText(FETCH_ERROR_HEADING_TEXT);
  expect(errorHeading).toBeInTheDocument();
});

test("If the user is not allowed to update the input fields because of a missing PIN, there should be an appropriate error message displayed", async () => {
  fetch.mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ canModify: false }),
    })
  );

  const { findByText, queryByText } = render(Settings, {
    deviceUID: "dev.testAirnote",
    productUID: "faux.airnote",
    pin: "",
  });

  let errorHeading = await findByText(NO_PIN_INVALID_PIN);
  let deviceSettingsUpdateButton = queryByText("Update Device Settings");
  let deviceOwnerInfoUpdateButton = queryByText("Update Device Owner");

  expect(errorHeading).toBeInTheDocument();
  expect(deviceSettingsUpdateButton).not.toBeInTheDocument();
  expect(deviceOwnerInfoUpdateButton).not.toBeInTheDocument();
});

test("If the user is allowed to update the input fields, when they save their changes, they should recieve a success message", async () => {
  fetch.mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ successfullyUpdated: true }),
    })
  );

  const { findByText, queryByText } = render(Settings, {
    deviceUID: "dev.testAirnote",
    productUID: "faux.airnote",
    pin: "123456",
  });

  let deviceNameInput = await screen.findByPlaceholderText("my-airnote-name");
  await fireEvent.change(deviceNameInput, {
    target: { value: "My Test Airnote" },
  });
  expect(deviceNameInput.value).toBe("My Test Airnote");
  let deviceSettingsUpdateButton = await findByText("Update Device Settings");
  await fireEvent.click(deviceSettingsUpdateButton);

  let errorHeading = queryByText(UNABLE_TO_SAVE_SETTINGS);
  let successMessage = await findByText("Settings saved.");

  expect(errorHeading).not.toBeInTheDocument();
  expect(successMessage).toBeInTheDocument();
});
