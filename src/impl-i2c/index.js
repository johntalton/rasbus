
let address = 0x77;

function _idToDevice(id) {
  return '/dev/i2c-' + id;
}

class I2CImpl {
  static init (device) {
    if(Number.isInteger(device)) {
      device = _idToDevice(device);
    }

    return new Promise((resolve, reject) => {
      const i2c = require('i2c');
      const bus = new i2c(address, { device: device, debug: false });
      const foo = new I2CImpl();
      foo.bus = bus;
      resolve(foo);
    });
  }

  read(cmd, length) {
    if(length === undefined) { length = 1; }
    return new Promise((resolve, reject) => {
      console.log('read', cmd, length);
      this.bus.readBytes(cmd, length, function(err, result) {
        if(err) { reject(err); return; }

        console.log('read2', err, result);
        // bug fix for the way spi returns, should move into spi code
        const out = Buffer.concat([Buffer.from([0xFF]), result]);

        resolve(out);
      });
    });
  }

  write(cmd, buffer) {
    return new Promise((resolve, reject) => {
      console.log('write', cmd, buffer);
      this.bus.writeBytes(cmd, buffer, function(err){
        console.log('write2', err);
        if(err){ console.log('reject!'); reject(err); return; }
        resolve([]);
      });
    });
  }
}

module.exports = I2CImpl;
