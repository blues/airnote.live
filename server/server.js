"use strict";
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const axios = require("axios");

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0", // needed for Render deployment
});

const NOTEHUB_BASE_URL = "https://api.notefile.net";
const AIRNOTE_PROJECT_UID = "app:2606f411-dea6-44a0-9743-1130f57d77d8";
const HEADERS = {
  "Content-Type": "application/json",
  "X-SESSION-TOKEN": process.env.HUB_AUTH_TOKEN,
};
const CORS_OPTIONS = {
  origin: ["http://localhost:5555", "https://airnote.live"],
};
const INITIAL_TIMEFRAME = "8 days";

const getEvents = (deviceUID, timeframe) => {
  if (timeframe === "undefined") {
    /* this function is originally fetched on mount with 8 days' worth of data to
    populate the AQI average history with the previous week's data AND
    display today's most current reading as well */
    timeframe = INITIAL_TIMEFRAME;
  }

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
        where: `.file::text='_air.qo' and .device::text='${deviceUID}' and .modified >= now()-interval '${timeframe}'`,
      },
    },
    {
      headers: HEADERS,
    }
  );
};

const getEnvVarsReadWrite = (airnoteProductUID, deviceUID, pin) => {
  return axios.get(
    `${NOTEHUB_BASE_URL}/v1/products/${airnoteProductUID}/devices/${deviceUID}/environment_variables_with_pin`,
    {},
    { headers: { "Content-Type": "application/json", "X-Auth-Token": pin } }
  );
};

// read only env vars
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
      cors: CORS_OPTIONS,
      handler: async (request, h) => {
        const deviceUID = request.query.device_uid;
        const timeframe = request.query.timeframe;
        const allEvents = [];
        let erred;

        await Promise.all([
          getEnvironmentVariables(deviceUID),
          getEvents(deviceUID, timeframe),
        ])
          .then((responses) => {
            const [envVarResponse, eventsResponse] = responses;
            let serialNumber = envVarResponse.data.environment_variables._sn;
            allEvents.push(...eventsResponse.data);
            allEvents.forEach((entry) => (entry.serial_number = serialNumber));
          })
          .catch((err) => {
            console.error(err);
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
    path: "/settings",
    options: {
      cors: CORS_OPTIONS,
      handler: async (request, h) => {
        const deviceUID = request.query.device_uid;
        let deviceDetails = {};
        let erred;
        await getEnvironmentVariables(deviceUID)
          .then((response) => {
            deviceDetails = response.data.environment_variables;
          })
          .catch((err) => {
            console.error(err);
            erred = true;
          });

        if (erred) {
          return h.response().code(500);
        } else {
          return h.response(deviceDetails).type("application/json").code(200);
        }
      },
    },
  });

  server.route({
    method: "GET",
    path: "/settings-modification-access",
    options: {
      cors: CORS_OPTIONS,
      handler: async (request, h) => {
        const airnoteProductUID = request.query.airnote_product_uid;
        const deviceUID = request.query.device_uid;
        const pin = request.query.pin;
        let canModify = false;
        let unauthorized = false;
        let erred;
        await getEnvVarsReadWrite(airnoteProductUID, deviceUID, pin)
          .then((response) => {
            console.log("Notehub Response");
            console.log(response);
            canModify = true;
          })
          .catch((err) => {
            /* if server throws a 401 unauthorized error in particular, 
            accept it and push to the client instead of erroring out */
            if (
              err.response.data.code === 401 &&
              err.response.data.err === "PIN is incorrect"
            ) {
              unauthorized = true;
              return;
            } else {
              erred = true;
            }
          });

        if (unauthorized) {
          return h.response(canModify).type("application/json").code(401);
        } else if (erred) {
          return h.response().code(500);
        } else {
          return h.response(canModify).type("application/json").code(200);
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
