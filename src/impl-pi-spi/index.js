
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

  read(cmd, len) {
    const length = len !== undefined ? len : 1;

    return new Promise((resolve, reject) => {
      const txBuf = Array.isArray(cmd) ?
        Buffer.from(cmd) :
        Buffer.from([cmd])
      this.spi.transfer(txBuf, length + 1, (e, buffer) =>{
        if(e){ reject(e); }
        // strip first byte
        //const out = Buffer.from(buffer, 1);
        const out = Buffer.alloc(buffer.length - 1);
        buffer.copy(out, 0, 1);
        resolve(out);
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
