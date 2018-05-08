function _writeMask(value){ return value & ~0x80; }

function _idToDevice(id) {
  return '/dev/spidev0.' + id;
}

const BASE_10 = 10;

class NodeSPIImpl {
  static init(dev) {
    const device = Number.isInteger(parseInt(dev, BASE_10)) ? _idToDevice(dev) : dev;

    return new Promise(resolve => {
      const SPI = require('spi'); // eslint-disable-line global-require
      // console.log('constrcut', device);
      const _spi = new SPI.Spi(device,
        { 'mode': SPI.MODE.MODE_0 },
        spi => {
          // TODO try/catch ?
          const ret = spi.open();
          console.log('open returned:', ret);

          resolve(new NodeSPIImpl(spi));
        });
    });
  }

  constructor(spi) {
    this.spi = spi;
  }

  get name() {
    return 'spi:' + this.spi.device;
  }

  read(cmd, len){
    const length = len !== undefined ? len : 1;
    return new Promise(resolve => {
      const wbuf = Array.isArray(cmd) ?
        Buffer.from([...cmd, ...(new Array(length - cmd.length).fill(0))]) :
        Buffer.from([cmd, ...(new Array(length).fill(0))]);
      const rbuf = Buffer.alloc(length + 1);
      this.spi.transfer(wbuf, rbuf, (device, buf) => {
        //const out = Buffer.from(buf, 1); // trim first byte
        const out = Buffer.alloc(buf.length - 1);
        buf.copy(out, 0, 1);
        //console.log('read', buf, out);
        resolve(out);
      });
    });
  }

  write(cmd, buffer){
    return new Promise(resolve => {
      const wbuf = Buffer.from([_writeMask(cmd), buffer]);
      this.spi.write(wbuf, buf => {
        resolve(buf);
      });
    });
  }
}

module.exports = NodeSPIImpl;
