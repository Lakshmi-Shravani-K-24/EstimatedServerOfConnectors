const assert = require('assert');
const {parseWithUnit} = require('../index');
const {expect} = require('chai');
describe('parseWithUnit', () => {
  it('should parse value with matching unit', () => {
    const correctValue = '10KW';
    const expectedUnit = 'KW';
    const validResult = parseWithUnit(correctValue, expectedUnit);
    assert.strictEqual(validResult.value, 10);
    assert.strictEqual(validResult.unit, expectedUnit);
  });

  it('should throw an error for value with non-matching unit', () => {
    const value = '20KWh'; // Value with a different unit
    const wrongExpectedUnit = 'KW';
    assert.throws(() => {
      parseWithUnit(value, wrongExpectedUnit);
    }, Error);
  });
  it('should throw error for invalid unit', () => {
    expect(() => parseWithUnit('10%', 'KW')).to.throw('Invalid unit. Expected KW, got %');
  });
  it('should throw error for invalid value', () => {
    expect(() => parseWithUnit('abc', 'KW')).to.throw('Invalid value: abc');
  });
});
describe('Regular Expression Anchors Test', () => {
  it('should match the pattern with $ anchor at the end', () => {
    const validValue = '10KW';
    const expectedUnit = 'KW';
    const result = parseWithUnit(validValue, expectedUnit);
    assert.strictEqual(result.value, 10);
    assert.strictEqual(result.unit, expectedUnit);
  });

  it('should not match the pattern without $ anchor at the end', () => {
    const invalidEndValue = '10KWextra';
    const expectedUnit = 'KW';
    assert.throws(() => {
      parseWithUnit(invalidEndValue, expectedUnit);
    }, Error);
  });

  it('should not match the pattern without ^ anchor at the beginning', () => {
    const invalidStartValue = 'extraKW10';
    const expectedUnit = 'KW';
    assert.throws(() => {
      parseWithUnit(invalidStartValue, expectedUnit);
    }, Error);
  });
});
