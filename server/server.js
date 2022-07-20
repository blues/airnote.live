"use strict";
const fns = require("date-fns");
const Hapi = require("@hapi/hapi");
const axios = require("axios");

const server = Hapi.server({
  port: 3001,
  host: "0.0.0.0", // needed for Render deployment
});

const NOTEHUB_BASE_URL =
  "https://api.notefile.net/v1/projects/app:2606f411-dea6-44a0-9743-1130f57d77d8";
const HEADERS = {
  "Content-Type": "application/json",
  "X-SESSION-TOKEN": process.env.HUB_AUTH_TOKEN,
};

const getEightDaysAgo = () => {
  const date = new Date();
  const rawEpochDate = fns.sub(date, { minutes: 60 * 24 * 8 });
  const formattedEpochDate = Math.round(
    rawEpochDate.getTime() / 1000
  ).toString();
  return formattedEpochDate;
};

const getEvents = (deviceUID, startDate, since) => {
  return axios.get(
    NOTEHUB_BASE_URL + "/events",
    {
      params: {
        deviceUIDs: deviceUID,
        startDate: startDate,
        since: since,
      },
    },
    {
      headers: HEADERS,
    }
  );
};

const getEnvironmentVariables = (deviceUID) => {
  return axios.get(
    `${NOTEHUB_BASE_URL}/devices/${deviceUID}/environment_variables`,
    {},
    {
      headers: HEADERS,
    }
  );
};

const init = async () => {
  await server.register([
    {
      plugin: require("@hapi/inert"),
      options: {},
    },
    {
      plugin: require("hapi-pino"),
      options: {
        prettyPrint: true,
        logEvents: ["response", "onPostStart"],
      },
    },
  ]);

  server.route({
    method: "GET",
    path: "/",
    options: {
      cors: {
        origin: ["http://localhost:5555", "https://airnote.live"],
      },
      handler: async (request, h) => {
        const deviceUID = request.query.device_uid;
        const startDate = getEightDaysAgo();
        const allEvents = [];
        let serialNumber;
        let since = "";
        let allEventsFound = false;

        try {
          const response = await getEnvironmentVariables(deviceUID);
          serialNumber = response.data.environment_variables._sn;
        } catch (err) {
          console.log(err);
          return h.response().code(500);
        }

        while (!allEventsFound) {
          try {
            const response = await getEvents(deviceUID, startDate, since);
            const filteredData = response.data.events.filter((entry) => {
              return entry.file === "_air.qo";
            });
            filteredData.forEach(
              (entry) => (entry.serial_number = serialNumber)
            );
            allEvents.push(...filteredData);
            if (response.data.has_more) {
              since = response.data.through;
            } else {
              allEventsFound = true;
            }
          } catch (err) {
            console.log(err);
            return h.response().code(500);
          }
        }

        return h.response(allEvents).type("application/json").code(200);
      },
    },
  });

  server.route({
    method: "GET",
    path: "/health",
    options: {
      handler: async (request, h) => {
        return h.response({}).type("application/json").code(200);
      },
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
