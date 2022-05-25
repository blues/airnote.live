"use strict";
const Hapi = require("@hapi/hapi");
const axios = require("axios");

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0", // needed for Render deployment
});

const buildBody = (device_uid, to, from) => {
  return {
    size: 500,
    sort: [
      {
        when_captured: {
          order: "desc",
        },
      },
    ],
    query: {
      bool: {
        must: [],
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    device_urn: "note:" + device_uid,
                  },
                },
              ],
            },
          },
          {
            range: {
              service_uploaded: {
                format: "strict_date_optional_time",
                gte: from,
                lte: to,
              },
            },
          },
        ],
      },
    },
  };
};

const url =
  "https://40ad140d461d810ac41ed710b5c7a5b6.us-west-2.aws.found.io:9243/_search";
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Basic " +
    new Buffer(
      process.env.SAFECAST_USERNAME + ":" + process.env.SAFECAST_PASSWORD
    ).toString("base64"),
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
        const device_uid = request.query.device_uid;
        const to = request.query.to;
        const from = request.query.from;

        try {
          const response = await axios.post(
            url,
            buildBody(device_uid, to, from),
            {
              headers: headers,
            }
          );
          return h.response(response.data).type("application/json").code(200);
        } catch (err) {
          return h.response().code(500);
        }
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
