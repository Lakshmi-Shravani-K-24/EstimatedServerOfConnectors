const assert = require('assert');
const {server, calculateChargingTime} = require('../index');
const {expect} = require('chai');
const request = require('supertest')(server);

describe('GET /connectors/estimatedChargingTime', () => {
  it('should respond with estimated charging time', async () => {
    const response = await request
        .get('/connectors/estimatedChargingTime')
        .query({connectorPower: '10KW', batteryCapacity: '40KWh', soc: '50%'});

    assert.strictEqual(response.status, 200);
    const estimatedTime = response.body.estimatedTime;
    assert(estimatedTime.hours !== undefined && estimatedTime.minutes !== undefined);
  });

  it('should respond with 400 error for invalid parameters', async () => {
    const response = await request
        .get('/connectors/estimatedChargingTime')
        .query({connectorPower: 'invalid', batteryCapacity: '40KWh', soc: '50%'});

    assert.strictEqual(response.status, 400);
    assert(response.body.error !== undefined);
  });
});

describe('calculateChargingTime', () => {
  it('should calculate charging time correctly', () => {
    const chargingTime = calculateChargingTime(10, 40, 0.5);
    assert.strictEqual(chargingTime.hours, '2.0');
    assert.strictEqual(chargingTime.minutes, '120.0');
  });
  it('should throw an error for invalid SOC value', () => {
    expect(() => calculateChargingTime(7, 60, 1)).to.throw('Invalid SOC value: 1');
  });
  it('should throw an error for invalid SOC value (greater than or equal to 1)', () => {
    expect(() => calculateChargingTime(7, 60, 1.2)).to.throw('Invalid SOC value: 1.2');
  });
});


