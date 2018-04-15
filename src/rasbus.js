"use strict";

/**
 *
 **/
class Rasbus {
  static byname(name) {
    const normalName = name.replace('-', '').toLowerCase();
    const bus = Rasbus.busMap.find(item => item.name === normalName);
    if(bus === undefined) { throw Error('unknown bus name: ' + normalName); }
    if(bus._impl === undefined) {
      bus._impl = require(bus.impl);
    }
    return bus._impl;
  }

  static names(type) {
    const filtered = (type === undefined) ?
      Rasbus.busMap :
      Rasbus.busMap.filter(item => item.type === type.toLowerCase());
    return filtered.map(item => item.name);
  }
}

Rasbus.busMap = [
  // I2C
  // { name: 'raspii2c', type: 'i2c', impl: './impl-i2c-raspii2c' },
  { name: 'i2cbus', type: 'i2c', impl: './impl-i2c-bus' },
  { name: 'i2c',    type: 'i2c', impl: './impl-i2c' },
  // SPI
  { name: 'spidevice', type: 'spi', impl: './impl-spi-device' }, // still updated
  { name: 'pispi',  type: 'spi', impl: './impl-pi-spi' }, // old
  { name: 'spi',    type: 'spi', impl: './impl-spi' }, // oldest
];




module.exports = Rasbus;
