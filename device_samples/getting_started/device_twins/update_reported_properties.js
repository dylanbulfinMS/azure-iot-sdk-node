// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Choose a protocol by uncommenting one of these transports.
var Protocol = require('azure-iot-device-mqtt').Mqtt;
// var Protocol = require('azure-iot-device-amqp').Amqp;
// var Protocol = require('azure-iot-device-http').Http;
// var Protocol = require('azure-iot-device-mqtt').MqttWs;
// var Protocol = require('azure-iot-device-amqp').AmqpWs;

const Client = require('azure-iot-device').Client;
const deviceConnectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING ?? '';
const logRed = '\x1b[31m%s\x1b[0m';

// make sure we have a connection string before we can continue
if (deviceConnectionString === '' || deviceConnectionString === undefined) {
  console.error(logRed, 'Missing device connection string');
  process.exit(0);
}

// create the IoTHub client
const client = Client.fromConnectionString(deviceConnectionString, Protocol);
console.log('Client created.');

// connect to the hub
client.open(function (err) {
  if (err) {
    console.error(logRed, `Error opening client: ${err.message}`);
  } else {
    console.log('Client opened.');

    // create device Twin
    client.getTwin(function (err, twin) {
      if (err) {
        console.error(logRed, `Error getting twin: ${err.message}`);
      } else {
        console.log('Twin created.');     

        // create a patch to send to the hub
        const patch = {
          firmwareVersion:'1.2.1',
          weather:{ temperature: 72, humidity: 17 }
        };

         // send the patch to update reported properties
        twin.properties.reported.update(patch, function(err) {
          if (err) {
            console.log(logRed, `Error updating reported properties: ${err.message}`);
            process.exit(0);
          } 
          else { 
            console.log('Twin state reported successfully.');    
            process.exit(0);        
          }
        });
      }
    });  
  }
});