
// todo move to import all and drop dynamic loader form old

/**
 *
 **/
class Rasbus {
  static bytype(type) {
    return require(Rasbus.busMap // eslint-disable-line global-require
      .filter(item => item.type === type)
      .find(item => true).impl);
  }
}

Rasbus.busMap = [
  // I2C
  { name: 'i2cbus', type: 'i2c', impl: './fivdi/i2c-bus.js' },
  // SPI
  { name: 'spidevice', type: 'spi', impl: './fivdi/spi-device.js' },
  // GPIO
  { name: 'onoff', type: 'gpio', impl: './fivdi/onoff.js'}
];

module.exports = { Rasbus };
