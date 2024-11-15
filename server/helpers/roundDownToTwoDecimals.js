const roundDownToTwoDecimals = (value) => {
  return Math.floor(value * 100) / 100;
};

module.exports = roundDownToTwoDecimals;