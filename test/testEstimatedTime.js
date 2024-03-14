const assert = require('assert');
const {server, calculateChargingTime} = require('../index');
const request = require('supertest')(server);
const {expect} = require('chai');

describe('Test GET /connectors/estimatedChargingTime Route', () => {
  it('should respond with estimated charging time', async () => {
    const response = await request
        .get('/connectors/estimatedChargingTime')
        .query({connectorPowerInKiloWatt: '10',
          batteryCapacityInKiloWattPerHour: '40',
          socInPercentage: '50'});
    assert.strictEqual(response.status, 200);
    assert( response.body.estimatedTimeInMinutes!== undefined);
  });
  it('should throw an error if SOC exceeds 100%', async () => {
    const invalidSocResponse = await request
        .get('/connectors/estimatedChargingTime')
        .query({
          connectorPowerInKiloWatt: '10',
          batteryCapacityInKiloWattPerHour: '20',
          socInPercentage: '101', // Exceeds 100%
        });

    expect(invalidSocResponse.status).to.equal(400);
    expect(invalidSocResponse.body).to.have.property('error', 'SOC should not exceed 100%');
  });
});

describe('Test calculateChargingTime function', () => {
  it('should calculate charging time correctly', () => {
    const chargingTime = calculateChargingTime(10, 40, 0.5);
    assert.strictEqual(chargingTime.value, '120.0');
  });
});


