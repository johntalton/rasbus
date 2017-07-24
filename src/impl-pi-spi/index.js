
class PiSPIImpl {
  static init(device) {
    const SPI = require('pi-spi');
    const spi = SPI.initialize(device);
    spi.clockSpeed(5 * 1000 * 1000); //1350000

    const foo = new PiSPIImpl();
    foo.spi = spi;
    return Promise.resolve(foo);
  }

  read(cmd, length) {
    if(length === undefined){ length = 1; }
    return new Promise((resolve, reject) => {
      const txBuf = Array.isArray(cmd) ? 
        Buffer.from(cmd) :
        Buffer.from([cmd])
      this.spi.transfer(txBuf, length + 1, function(e, buffer){
        if(e){ reject(e); }
        resolve(buffer);
      });
    });
  }

  write(cmd, buffer) {
    return new Promise((resolve, reject) => {
      const txBuf = new Buffer([cmd, buffer]);
      this.spi.write(txBuf, function(e, buffer){
        if(e){ reject(e); }
        resolve(buffer);
      });
    });
  }
}

module.exports = PiSPIImpl;
