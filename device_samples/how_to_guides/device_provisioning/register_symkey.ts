// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

import { Mqtt as Protocol } from 'azure-iot-device-mqtt';
import { Client, Message, Twin } from 'azure-iot-device';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { ProvisioningDeviceClient, RegistrationResult } from 'azure-iot-provisioning-device';

// change the following using statement if you would like to try another protocol.
import { Mqtt as ProvProtocol } from 'azure-iot-provisioning-device-mqtt';
import { RegistrationClient } from 'azure-iot-provisioning-device/dist/interfaces';
// import { Amqp as ProvProtocol } from 'azure-iot-provisioning-device-amqp';
// import { Http as ProvProtocol } from 'azure-iot-provisioning-device-http';
// import { MqttWs as ProvProtocol } from 'azure-iot-provisioning-device-mqtt';
// import { AmqpWs as ProvProtocol } from 'azure-iot-provisioning-device-amqp';

const provisioningHost: string = process.env.IOTHUB_DEVICE_DPS_ENDPOINT ?? 'global.azure-devices-provisioning.net';
const idScope: string = process.env.IOTHUB_DEVICE_DPS_ID_SCOPE ?? '';
const registrationId: string = process.env.IOTHUB_DEVICE_DPS_REGISTRATION_ID ?? '';
const symmetricKey: string = process.env.IOTHUB_DEVICE_DPS_SYMMETRIC_KEY ?? '';
const logRed: string = '\x1b[31m%s\x1b[0m';

const securityClient: SymmetricKeySecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
const provisioningClient: RegistrationClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvProtocol(), securityClient);

// Register the device.
provisioningClient.setProvisioningPayload({a: 'b'});
provisioningClient.register(function(err: any, result: any) {
  if (err) {
    console.log(logRed, "Error registering device: " + err.message);
  } else {
    console.log('Registration succeeded...');
    console.log(' assigned hub=' + result.assignedHub);
    console.log(' deviceId=' + result.deviceId);
    console.log(' payload=' + JSON.stringify(result.payload));

    const connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;
    const hubClient = Client.fromConnectionString(connectionString, Protocol);

    hubClient.open(function(error: Error | undefined) {
      if (error) {
        console.error(logRed, 'Could not connect: ' + error.message);
      } else {
        console.log('Client connected');

        hubClient.sendEvent(new Message('Hello world'), function(er: Error | undefined, res: any) {
          if (er) console.log(logRed, 'Send error: ' + er.message);
          if (res) console.log('Send status: ' + res.constructor.name);
          process.exit(0);
        });
      }
    });
  }
});
