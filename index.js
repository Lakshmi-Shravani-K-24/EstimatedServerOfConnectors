/* eslint-disable max-len */
/* eslint-disable complexity */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3001;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

function calculateChargingTime(connectorPower, batteryCapacity, soc) {
  if (soc<1) {
    const chargingTimeHours = (batteryCapacity * (1 - soc)) / connectorPower;
    const chargingTimeMinutes = chargingTimeHours * 60; // Convert hours to minutes
    return {
      hours: chargingTimeHours.toFixed(1),
      minutes: chargingTimeMinutes.toFixed(1),
    };
  } else {
    throw new Error(`Invalid SOC value: ${soc}`);
  }
}

function parseWithUnit(value, expectedUnit) {
  const regex = /^(\d+)(\w+|%+)$/;
  const match = value.match(regex);
  if (!match || match.length !== 3) {
    throw new Error(`Invalid value: ${value}`);
  }
  const numericValue = parseFloat(match[1]);
  const unit = match[2];
  if (unit !== expectedUnit) {
    throw new Error(`Invalid unit. Expected ${expectedUnit}, got ${unit}`);
  }
  return {value: numericValue, unit};
}


app.get('/connectors/estimatedChargingTime', (req, res) => {
  try {
    const {connectorPower, batteryCapacity, soc} = req.query;
    const parsedConnectorPower = parseWithUnit(connectorPower, 'KW');
    const parsedBatteryCapacity = parseWithUnit(batteryCapacity, 'KWh');
    const parsedSoc = parseWithUnit(soc, '%');
    const finalsoc=parsedSoc.value/100;

    const estimatedTime = calculateChargingTime(parsedConnectorPower.value, parsedBatteryCapacity.value, finalsoc);
    res.json({estimatedTime});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = {server, calculateChargingTime, parseWithUnit};
