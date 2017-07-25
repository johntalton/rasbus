
module.exports = {
  pispi: require('./impl-pi-spi'),
  spi: require('./impl-spi'),

  i2c: require('./impl-i2c'),
  i2cbus: require('./impl-i2c-bus')
};
