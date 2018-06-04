
const { I2CBus } = require('./fivdi/i2c-bus.js');
const { SpiDevice } = require('./fivdi/spi-device.js');
const { OnOffIPromise } = require('./fivdi/onoff.js');

class Rasbus {
}

Rasbus.i2c = I2CBus;
Rasbus.spi = SpiDevice;
Rasbus.gpio = OnOffIPromise;

module.exports = { Rasbus };
