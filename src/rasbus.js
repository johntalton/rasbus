"use strict";

class Rasbus {
  static byname(name) {
    switch(name.toLowerCase()) {
      case 'pispi': return Rasbus.pispi; break;
      case 'spi': return Rasbus.spi; break;

      case 'i2cbus': return Rasbus.i2cbus; break;
      case 'i2c': return Rasbus.i2c; break;

      default:
        throw Error('unknown bus name', name);
    }
  }
}

Rasbus.pispi = require('./impl-pi-spi'),
Rasbus.spi = require('./impl-spi'),

Rasbus.i2c = require('./impl-i2c'),
Rasbus.i2cbus = require('./impl-i2c-bus')


module.exports = Rasbus;
