'use strict';
const Hapi = require('@hapi/hapi');
const https = require('https');

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0" // needed for Render deployment
});

const init = async () => {
  await server.register([
    {
      plugin: require('@hapi/inert'),
      options: {}
    },
    {
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: true,
        logEvents: ["response", "onPostStart"]
      }
    }]);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return 'Username: ' + process.env.username +
        ' device_uid: ' + request.query.device_uid
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();