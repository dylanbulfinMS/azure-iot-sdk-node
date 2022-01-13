// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Choose a protocol by uncommenting one of these transports.
const Protocol = require('azure-iot-device-mqtt').Mqtt;
// const Protocol = require('azure-iot-device-amqp').Amqp;
// const Protocol = require('azure-iot-device-http').Http;
// const Protocol = require('azure-iot-device-mqtt').MqttWs;
// const Protocol = require('azure-iot-device-amqp').AmqpWs;

const ModuleClient = require('azure-iot-device').ModuleClient;
const logRed = '\x1b[31m%s\x1b[0m';

ModuleClient.fromEnvironment(Protocol, function (err, client) {
  if (err) {
    console.error(logRed, "Could not create client: " + err.toString());
    process.exit(-1);
  } else {
    console.log('Got client');

    client.on('error', function (err) {
      console.error(logRed, err.message);
    });

    // connect to the edge instance
    client.open(function (err) {
      if (err) {
        console.error(logRed, 'Could not connect: ' + err.message);
      } else {
        console.log('Client connected');

        client.onMethod('doSomethingInteresting', function(request, response) {
          console.log('doSomethingInteresting called');

          if(request.payload) {
            console.log('Payload:');
            console.dir(request.payload);
          }

          var responseBody = {
            message: 'doSomethingInteresting succeeded'
          };
          response.send(200, responseBody, function(err) {
            if (err) {
              console.log(logRed, 'Failed sending method response: ' + err);
            } else {
              console.log('Successfully sent method response');
            }
          });
        });
      }
    });
  }
});