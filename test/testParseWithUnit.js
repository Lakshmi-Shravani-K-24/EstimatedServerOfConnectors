const assert = require('assert');
const {parseWithUnit} = require('../index');

describe('parseWithUnit', () => {
  it('should parse value with matching unit', () => {
    const correctValue = '10KW';
    const expectedUnit = 'KW';
    const result = parseWithUnit(correctValue, expectedUnit);
    assert.strictEqual(result.value, 10);
    assert.strictEqual(result.unit, expectedUnit);
  });

  it('should throw an error for value with non-matching unit', () => {
    const value = '20KWh'; // Value with a different unit
    const wrongExpectedUnit = 'KW';
    assert.throws(() => {
      parseWithUnit(value, wrongExpectedUnit);
    }, Error);
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
    const invlaidEndValue = '10KWextra';
    const expectedUnit = 'KW';
    assert.throws(() => {
      parseWithUnit(invlaidEndValue, expectedUnit);
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
