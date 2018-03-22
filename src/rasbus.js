"use strict";

/**
 *
 **/
class Rasbus {
  static byname(name) {
    const bus = Rasbus.busMap.find(item => item.name === name.toLowerCase());
    if(bus === undefined) { throw Error('unknown bus name: ' + name); }
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
  { name: 'pispi',  type: 'spi', impl: './impl-pi-spi' },
  { name: 'spi',    type: 'spi', impl: './impl-spi' },
];




module.exports = Rasbus;
