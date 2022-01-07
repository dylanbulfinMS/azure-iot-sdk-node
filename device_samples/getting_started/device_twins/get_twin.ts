// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Choose a protocol by uncommenting one of these transports.
import { Mqtt as Protocol } from 'azure-iot-device-mqtt';
// import { Amqp as Protocol } from 'azure-iot-device-amqp';
// import { Http as Protocol } from 'azure-iot-device-Http';
// import { MqttWs as Protocol } from 'azure-iot-device-mqtt';
// import { AmqpWs as Protocol } from 'azure-iot-device-amqp';

import { Client } from 'azure-iot-device';

const deviceConnectionString: string = process.env.IOTHUB_DEVICE_CONNECTION_STRING ?? '';
const logRed: string = '\x1b[31m%s\x1b[0m';

// make sure we have a connection string before we can continue
if (deviceConnectionString === '' || deviceConnectionString === undefined) {
    console.error(logRed, 'Missing device connection string');
    process.exit(0);
}

// create the IoTHub client
const client: Client = Client.fromConnectionString(deviceConnectionString, Protocol);
console.log('Client created.');

// connect to the hub
client.open(function(err: any) {
  if (err) {
    console.error(logRed, `Error opening client: ${err.message}`);
  }  else {
    console.log('Client opened.');

    // Create device Twin
    client.getTwin(function(error: any, twin: any) {
      if (error) {
        console.error(logRed, `Error getting twin: ${error.message}`);
      } else {
        console.log('Twin created.');
        console.log('Getting twin properties...');
        console.log(JSON.stringify(twin.properties));
        process.exit(0);
      }
    });
  }
});