const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3001;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

function calculateChargingTime(connectorPower, batteryCapacity, soc) {
  const chargingTimeHours = (batteryCapacity * (1 - soc)) / connectorPower;
  const chargingTimeInMinutes = chargingTimeHours * 60; // Convert hours to minutes
  return {
    value: chargingTimeInMinutes.toFixed(1),
  };
}

function validateParameter(param, paramName) {
  function checkRequired(param, paramName) {
    if (param === null || param === undefined) {
      throw new Error(`Missing required parameter: ${paramName}.`);
    }
  }

  checkRequired(param, paramName);

  const value = parseFloat(param);
  if (isNaN(value) || value < 0) {
    throw new Error(`Invalid ${paramName}. ${paramName} must be a number`);
  }
  return value;
}

app.get('/connectors/estimatedChargingTime', (req, res) => {
  try {
    const connectorPower = validateParameter(req.query.connectorPowerInKiloWatt,
        'connectorPowerInKiloWatt');
    const batteryCapacity = validateParameter(req.query.batteryCapacityInKiloWattPerHour,
        'batteryCapacityInKiloWattPerHour');
    const soc = validateParameter(req.query.socInPercentage, 'socInPercentage');
    const finalsoc = soc / 100;
    if (finalsoc > 1) {
      throw new Error('SOC should not exceed 100%');
    }
    const estimatedTimeInMinutes = calculateChargingTime(connectorPower, batteryCapacity, finalsoc);

    res.json({estimatedTimeInMinutes});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});


module.exports = {server, calculateChargingTime, validateParameter};
