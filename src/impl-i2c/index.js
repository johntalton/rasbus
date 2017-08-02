
function _idToDevice(id) {
  return '/dev/i2c-' + id;
}

class I2CImpl {
  static init (device, address) {
    if(Number.isInteger(parseInt(device))) {
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

  get name() {
    // console.log(this.bus);
    return 'i2c:' + this.bus.options.device + ':' + '0x' + this.bus.address.toString(16);
  }

  read(cmd, length) {
    if(length === undefined) { length = 1; }
    return new Promise((resolve, reject) => {
      // console.log('read', cmd, length);
      this.bus.readBytes(cmd, length, function(err, result) {
        if(err) { reject(err); return; }
        resolve(result);
      });
    });
  }

  write(cmd, buffer) {
    if(buffer === undefined) { return this.writeSpecial(cmd); }

    return new Promise((resolve, reject) => {
      // console.log('write', cmd, buffer);
      const txAry = Array.isArray(buffer) ? buffer : [buffer];
      this.bus.writeBytes(cmd, txAry, function(err){
        // console.log('write2', err);
        if(err){ console.log('reject!'); reject(err); return; }
        resolve([]);
      });
    });
  }

  writeSpecial(special) {
    return new Promise((resolve, reject) => {
      this.bus.write(Buffer.from([special]), function(err) {
        if(err) { reject(err); }
        resolve([]);
      });
    });
  }
}

module.exports = I2CImpl;
