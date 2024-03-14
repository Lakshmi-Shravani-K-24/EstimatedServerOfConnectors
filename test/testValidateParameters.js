/* eslint-disable max-len */
const {expect} = require('chai');
const {validateParameter} = require('../index');

describe('validateParameter function', () => {
  it('should throw an error if parameter is missing', () => {
    expect(() => validateParameter(null, 'param')).to.throw('Missing required parameter: param.');
    expect(() => validateParameter(undefined, 'param')).to.throw('Missing required parameter: param.');
  });

  it('should throw an error if parameter is not a number', () => {
    expect(() => validateParameter('abc', 'param')).to.throw('Invalid param. param must be a number');
    expect(() => validateParameter('', 'param')).to.throw('Invalid param. param must be a number');
  });

  it('should throw an error if parameter is less than 0', () => {
    expect(() => validateParameter(-1, 'param')).to.throw('Invalid param. param must be a number');
  });

  it('should return the value if it is a valid number', () => {
    expect(validateParameter(10, 'param')).to.equal(10);
    expect(validateParameter(0, 'param')).to.equal(0);
    expect(validateParameter('50', 'param')).to.equal(50);
  });
});
