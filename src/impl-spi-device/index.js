function _writeMask(value){ return value & ~0x80; }

class SpiDeviceImpl {
  static init(...id) {
    //console.log('hi 👍');

    return new Promise((resolve, reject) => {
      if(id.length !== 2) { throw Error('incorrect parameters ' + id); }
      const spiDev = require('spi-device');

      const device = spiDev.open(id[0], id[1], err => {
        if(err) { reject(err); return; }
        const impl = new SpiDeviceImpl();
        impl._bus = device;
        resolve(impl);
      });
    });
  }

  read() {}

  write() {}
}

module.exports = SpiDeviceImpl;

