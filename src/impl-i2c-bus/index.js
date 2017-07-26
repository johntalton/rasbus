const address = 0x77;



class I2CBusImpl {
  static init(device) {
    if(!Number.isInteger(parseInt(device))) {
      throw new Error('not a number ' + device);
    }

    return new Promise((resolve, reject) => {
      const i2c = require('i2c-bus');
      const i2c1 = i2c.open(device, function(err){
        if(err){ reject(err); return; }
        const foo = new I2CBusImpl();
        foo.i2c = i2c1;
        resolve(foo);
      });
    });
  }

  get name() {
    return 'i2c-bus:' + this.i2c.device;
  }

  read(cmd, length){
    if(length === undefined){ length = 1; }
    return new Promise((resolve, reject) => {
      // console.log('read', cmd, length);
      this.i2c.readByte(address, cmd, function(err, byte) {
        if(err) { reject(err); return; }
        resolve(Buffer.from([0xFF, byte]));
      });
    });
  }

  write(cmd, buffer){
    return new Promise((resolve, reject) => {
      this.i2c.writeByte(address, cmd, buffer, function(err){
        if(err){ reject(err); return; }
        resolve([]);
      });
    });
  }
}

module.exports = I2CBusImpl;

