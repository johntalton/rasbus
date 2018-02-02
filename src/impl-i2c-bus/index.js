
class I2CBusImpl {
  static init(device, address) {
    if(!Number.isInteger(parseInt(device))) {
      throw new Error('not a number ' + device);
    }

    return new Promise((resolve, reject) => {
      const i2c = require('i2c-bus');
      const i2c1 = i2c.open(device, function(err){
        if(err){ reject(err); return; }
        const foo = new I2CBusImpl();
        foo.i2c = i2c1;
        foo._address = address;
        resolve(foo);
      });
    });
  }

  get name() {
    // console.log(this.i2c);
    const prefix = '/dev/i2c-'; // taken from i2c-bus github page // TODO import
    return 'i2c-bus:' + prefix + this.i2c._busNumber;
  }

  close() {
    return new Promise((resolve, reject) => {
      this.i2c.close(err => {
        if(err) { reject(err); return; }
        resolve();
      });
    });
  }

  read(cmd, length){
    if(length === undefined){ length = 1; }
    return new Promise((resolve, reject) => {
      // console.log('read', cmd, length);
      const rxBuf = Buffer.alloc(length);
      this.i2c.readI2cBlock(this._address, cmd, length, rxBuf, function(err, resultlength, bytes) {
        // console.log(err, bytes, typeof bytes);
        if(err) { reject(err); return; }
        resolve(bytes);
      });
    });
  }

  write(cmd, buffer){
    if(buffer === undefined) { return this.writeSpecial(cmd); }

    return new Promise((resolve, reject) => {
      const txByte = Array.isArray(buffer) ? buffer[0] : buffer;
      this.i2c.writeByte(this._address, cmd, txByte, function(err){
        if(err){ reject(err); return; }
        resolve([]);
      });
    });
  }

  writeSpecial(special) {
    console.log('write special 0x' + special.toString(16));
    return new Promise((resolve, reject) => {
      this.i2c.sendByte(this._address, special, function(err) {
        // console.log('here', err);
        if(err){ reject(err); return; }
        resolve([]);
      });
    });
  }
}

module.exports = I2CBusImpl;

