import { AIRNOTE_PRODUCT_UID } from "../../src/constants";
import {
  checkDeviceEnvVarModificationAccess,
  getCurrentDeviceFromUrl,
  getDeviceEnvVars,
  getReadings,
  updateDeviceEnvVars,
} from "../../src/services/device";

beforeEach(() => {
  localStorage.clear();
  fetch.mockClear();
});

test("Calculate daily averages for aqi, pm1, pm2.5, and pm10", () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            body: {
              aqi: 10,
              pm02_5: 10,
              pm10_0: 10,
            },
            when: "2021-01-01T10:01:01Z",
          },
          {
            body: {
              aqi: 20,
              pm01_0: 7,
              pm02_5: 20,
              pm10_0: 20,
            },
            when: "2021-01-01T10:01:01Z",
          },
        ]),
    })
  );

  getReadings().then((data) => {
    expect(data.history.aqi["January 01 2021"]).toBe(15);
    expect(data.history.pm1_0["January 01 2021"]).toBe(4);
    expect(data.history.pm2_5["January 01 2021"]).toBe(15);
    expect(data.history.pm10_0["January 01 2021"]).toBe(15);
  });
});

test("If there’s no device in the URL return an object with no device UID", () => {
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: "",
    search: "",
  });
  expect(currentDevice.deviceUID).toBe("");
});

test("If data is in the URL it should make it to the returned object", () => {
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: "/dev:123456789012345",
    search: "?product=product:org.airnote.solar.v1&pin=123456",
  });
  expect(currentDevice.deviceUID).toBe("dev:123456789012345");
  expect(currentDevice.pin).toBe("123456");
  expect(currentDevice.productUID).toBe("product:org.airnote.solar.v1");
});

test("If there’s no device in the URL, use a previous device’s info", () => {
  getCurrentDeviceFromUrl({
    pathname: "/dev:123456789012345",
    search: "?product=product:org.airnote.solar.v1&pin=123456",
  });
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: "",
    search: "",
  });

  expect(currentDevice.deviceUID).toBe("dev:123456789012345");
  expect(currentDevice.pin).toBe("123456");
  expect(currentDevice.productUID).toBe("product:org.airnote.solar.v1");
});

test("If you only have a device UID in the URL, get the pin and product UID from storage", () => {
  getCurrentDeviceFromUrl({
    pathname: "/dev:123456789012345",
    search: "?product=product:org.airnote.solar.v1&pin=123456",
  });
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: "/dev:123456789012345",
    search: "",
  });

  expect(currentDevice.deviceUID).toBe("dev:123456789012345");
  expect(currentDevice.pin).toBe("123456");
  expect(currentDevice.productUID).toBe("product:org.airnote.solar.v1");
});

test("If the device changes in the URL the data should change as well", () => {
  getCurrentDeviceFromUrl({
    pathname: "/dev:111",
    search: "?product=product:org.airnote.solar.v1&pin=111111",
  });
  const secondDevice = getCurrentDeviceFromUrl({
    pathname: "/dev:222",
    search: "?product=product:org.airnote.solar.v2&pin=222222",
  });

  expect(secondDevice.deviceUID).toBe("dev:222");
  expect(secondDevice.pin).toBe("222222");
  expect(secondDevice.productUID).toBe("product:org.airnote.solar.v2");

  const thirdDevice = getCurrentDeviceFromUrl({
    pathname: "/dev:333",
    search: "",
  });
  expect(thirdDevice.deviceUID).toBe("dev:333");
  expect(thirdDevice.pin).toBe("");
  expect(thirdDevice.productUID).toBe(AIRNOTE_PRODUCT_UID);
});

test("If the device is removed from the URL the last device viewed should persist", () => {
  getCurrentDeviceFromUrl({
    pathname: "/dev:111",
    search: "?product=product:org.airnote.solar.v1&pin=111111",
  });
  const device = getCurrentDeviceFromUrl({
    pathname: "",
    search: "",
  });

  expect(device.deviceUID).toBe("dev:111");
  expect(device.pin).toBe("111111");
  expect(device.productUID).toBe("product:org.airnote.solar.v1");
});

test("It should return the device's environment variables if device ID is supplied", () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          _air_indoors: "0",
          _air_mins: "usb:15;high:30;normal:30;low:720;0",
          _air_status: "pm2.5",
          _contact_affiliation: "Test Account",
          _contact_email: "test@test.com",
          _contact_name: "Tester",
          _sn: "test-airnote",
        }),
    })
  );

  getDeviceEnvVars("dev:testAirnote").then((data) => {
    expect(data._air_indoors).toBe("0");
    expect(data._contact_email).toBe("test@test.com");
    expect(data._sn).toBe("test-airnote");
  });
});

test("It should check if a user is authorized to modify device settings when device ID, product ID and PIN are provided", () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(false),
    })
  );

  checkDeviceEnvVarModificationAccess(
    "faux.airnote",
    "dev.testAirnote",
    1234
  ).then((data) => {
    expect(data).toStrictEqual({ canModify: false });
  });
});

test("It should attempt to update device environment variables when product ID, device ID, PIN, and variable body are provided", () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(false),
    })
  );

  const fauxVarsBody = {
    environment_variables: {
      _air_indoors: "0",
      _air_mins: "usb:15;high:30;normal:30;low:720;0",
      _air_status: "pm2.5",
      _contact_affiliation: "Test Account",
      _contact_email: "test@test.com",
      _contact_name: "Tester",
      _sn: "test-airnote",
    },
  };

  updateDeviceEnvVars(
    "faut.airnote",
    "dev.testAirnote",
    1234,
    fauxVarsBody
  ).then((data) => {
    expect(data).toStrictEqual({ successfullyUpdated: false });
  });
});
