'use strict';
const Hapi = require('@hapi/hapi');
const https = require('https');

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0" // needed for Render deployment
});

const buildBody = (device_uid, to, from) => {
  return {
    "size": 500,
    "sort": [
      {
        "service_uploaded": {
          "order": "desc"
        }
      }
    ],
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "bool": {
              "should": [
                {
                  "match_phrase": {
                    "device_urn": "note:" + device_uid
                  }
                }
              ]
            }
          },
          {
            "range": {
              "service_uploaded": {
                "format": "strict_date_optional_time",
                "gte": from,
                "lte": to
              }
            }
          }
        ]
      }
    }
  };
}

const options = {
  hostname: '40ad140d461d810ac41ed710b5c7a5b6.us-west-2.aws.found.io',
  port: 9243,
  path: '/_search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64')
  }
};

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
        logEvents: ['response', 'onPostStart']
      }
    }]);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const device_uid = request.query.device_uid;
      const to = request.query.to;
      const from = request.query.from;
      return new Promise(function(resolve, reject) {
        var req = https.request(options, res => {
          var data = '';
          res.on('data', chunk => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: 200,
              body: data
            });
          });
        });
        req.write(JSON.stringify(buildBody(device_uid, to, from)));
        req.end();
      });
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