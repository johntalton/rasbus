
const { I2CBus } = require('./fivdi/i2c-bus.js');
const { SpiDevice } = require('./fivdi/spi-device.js');
const { OnOffIPromise } = require('./fivdi/onoff.js');

class Rasbus {
  static bytype(type) {
    if(type === 'i2c') { return Rasbus.i2c; }
    if(type === 'spi') { return Rasbus.spi; }
    if(type === 'gpio') { return Rasbus.gpio; }
    throw Error('unknown rasbus type: ' + type);
  }
}

Rasbus.i2c = I2CBus;
Rasbus.spi = SpiDevice;
Rasbus.gpio = OnOffIPromise;

module.exports = { Rasbus };
