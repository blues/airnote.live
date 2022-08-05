"use strict";
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const axios = require("axios");

const server = Hapi.server({
  port: 3001,
  host: "0.0.0.0", // needed for Render deployment
});

const NOTEHUB_BASE_URL = "https://api.notefile.net";
const AIRNOTE_PROJECT_UID = "app:2606f411-dea6-44a0-9743-1130f57d77d8";
const HEADERS = {
  "Content-Type": "application/json",
  "X-SESSION-TOKEN": process.env.HUB_AUTH_TOKEN,
};

const getEvents = (deviceUID) => {
  return axios.post(
    `https://api.notefile.net/req?app=${AIRNOTE_PROJECT_UID}`,
    {
      req: "hub.app.data.query",
      query: {
        columns:
          ".body;.when;lat:(events.value->'best_lat');lon:(events.value->'best_lon');location:(events.value->'best_location')",
        limit: 1000,
        order: ".modified",
        descending: true,
        where: `.file::text='_air.qo' and .device::text='${deviceUID}' and .modified >= now()-interval '8 days'`,
      },
    },
    {
      headers: HEADERS,
    }
  );
};

const getEnvironmentVariables = (deviceUID) => {
  return axios.get(
    `${NOTEHUB_BASE_URL}/v1/projects/${AIRNOTE_PROJECT_UID}/devices/${deviceUID}/environment_variables`,
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
        const allEvents = [];
        let erred = false;

        await Promise.all([
          getEnvironmentVariables(deviceUID),
          getEvents(deviceUID),
        ])
          .then((responses) => {
            const [envVarResponse, eventsResponse] = responses;
            let serialNumber = envVarResponse.data.environment_variables._sn;
            allEvents.push(...eventsResponse.data);
            allEvents.forEach((entry) => (entry.serial_number = serialNumber));
          })
          .catch((err) => {
            console.log(err);
            erred = true;
          });

        if (erred) {
          return h.response().code(500);
        } else {
          return h.response(allEvents).type("application/json").code(200);
        }
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
