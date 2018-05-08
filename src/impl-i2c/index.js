
function _idToDevice(id) {
  return '/dev/i2c-' + id;
}

const BASE_10 = 10;

class I2CImpl {
  static init (device, address) {
    let path = device;
    if(Number.isInteger(parseInt(device, BASE_10))) {
      path = _idToDevice(device);
    }

    if(I2CImpl.i2c === undefined) { I2CImpl.i2c = require('i2c'); } // eslint-disable-line global-require
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

  deviceId(addr) {
    if(this.supportsDeviceId !== undefined) { console.log('realy?'); }
    return Promise.reject(Error('unsupported'));
  }

  close() {
    return Promise.resolve(this.bus.close());
  }

  read(cmd, len) {
    const length = len !== undefined ? len : 1;

    return new Promise((resolve, reject) => {
      // console.log('read', cmd, length);
      this.bus.readBytes(cmd, length, (err, result) => {
        //console.log(err);
        if(err) { reject(err); return; }
        resolve(result);
      });
    });
  }

  readSpecial(length) {
    return new Promise((resolve, reject) => {
      this.bus.read(length, (err, result) => {
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
      this.bus.writeBytes(cmd, txAry, err => {
        //  console.log('write2', err);
        if(err){ console.log('reject!'); reject(err); return; }
        resolve([]);
      });
    });
  }

  writeSpecial(special) {
    return new Promise((resolve, reject) => {
      this.bus.write(Buffer.from([special]), err => {
        if(err) { reject(err); }
        resolve([]);
      });
    });
  }


  readBuffer(length) { return Promise.reject(Error('unimplemented')); }
  writeBuffer(buf) { return Promise.reject(Error('unimplemented')); }
}

module.exports = I2CImpl;
