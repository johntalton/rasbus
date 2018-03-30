
function _idToDevice(id) {
  return '/dev/i2c-' + id;
}

class I2CImpl {
  static init (device, address) {
    let path = device;
    if(Number.isInteger(parseInt(device))) {
      path = _idToDevice(device);
    }

    if(I2CImpl.i2c === undefined) { I2CImpl.i2c = require('i2c'); }
    const bus = new I2CImpl.i2c(address, { device: path, debug: false });
    return Promise.resolve(new I2CImpl(bus));
  }

  constructor(bus) {
    this.bus = bus;
  }

  get name() {
    // console.log(this.bus);
    return 'i2c:' + this.bus.options.device + ':' + '0x' + this.bus.address.toString(16);
  }

  close() {
    return Promise.resolve(this.bus.close());
  }

  read(cmd, length) {
    if(length === undefined) { length = 1; }
    return new Promise((resolve, reject) => {
      // console.log('read', cmd, length);
      this.bus.readBytes(cmd, length, function(err, result) {
        //console.log(err);
        if(err) { reject(err); return; }
        resolve(result);
      });
    });
  }

  write(cmd, buffer) {
    if(buffer === undefined) { return this.writeSpecial(cmd); }

    return new Promise((resolve, reject) => {
      let txAry = buffer;
      if(!Array.isArray(txAry)) {
        if(!Buffer.isBuffer(txAry)) { txAry = [txAry]; }
      }
      //console.log('write', cmd.toString(16), txAry);
      this.bus.writeBytes(cmd, txAry, function(err){
        //  console.log('write2', err);
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
