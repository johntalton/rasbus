
function _writeMask(value){ return value & ~0x80; }

function _idToDevice(id) {
  return '/dev/spidev0.' + id;
}

class PiSPIImpl {
  static init(dev) {
    const device = Number.isInteger(dev) ? _idToDevice(dev) : dev;

    const SPI = require('pi-spi'); // eslint-disable-line global-require
    const spi = SPI.initialize(device);
    spi.clockSpeed(5 * 1000 * 1000); //1350000

    const foo = new PiSPIImpl();
    foo.spi = spi;
    return Promise.resolve(foo);
  }

  read(cmdbuf, len) {
    const length = len !== undefined ? len : 1;
    const cmd = Array.isArray(cmdbuf) ? cmdbuf : [cmdbuf];

    return new Promise((resolve, reject) => {
      const txBuf = Buffer.from([...cmd, ...new Array(length - cmd.length)]);

      this.spi.transfer(txBuf, length, (e, buffer) =>{
        if(e){ reject(e); }
        resolve(buffer);
      });
    });
  }

  write(cmd, buffer) {
    console.log(cmd, buffer);
    return new Promise((resolve, reject) => {
      const txBuf = Buffer.from([_writeMask(cmd), buffer]);
      this.spi.write(txBuf, (e, buf) =>{
        if(e){ reject(e); }
        resolve(buf);
      });
    });
  }
}

module.exports = PiSPIImpl;
