function _writeMask(value){ return value & ~0x80; }

function _idToDevice(id) {
  return '/dev/spidev0.' + id;
}

class NodeSPIImpl {
  static init(device) {
    if(Number.isInteger(device)) {
      devcie = _idToDevcie(devcie);
    }
    return new Promise((resolve, reject) => {
      const SPI = require('spi');
      new SPI.Spi(device,
        { 'mode': SPI.MODE['MODE_0'] },
        s => {
          s.open();

          const foo = new NodeSPIImpl();
          foo.spi = s;
          resolve(foo);
        });
    });
  }

  read(cmd, length){
    if(length === undefined){ length = 1; }
    return new Promise((resolve, reject) => {
      const wbuf = Array.isArray(cmd) ?
        Buffer.from([...cmd, ...(new Array(length - cmd.length).fill(0))]) :
        Buffer.from([cmd, ...(new Array(length).fill(0))]);
      const rbuf = Buffer.alloc(length + 1);
      this.spi.transfer(wbuf, rbuf, (device, buf) => {
        //const temp = Buffer.alloc(1);
        //buf.copy(temp, 0, 1);
        //console.log('the end ', buf, temp);
        //resolve(temp);
        resolve(buf);
      });
    });
  }

  write(cmd, buffer){
    return new Promise((resolve, reject) => {
      const wbuf = Buffer.from([_writeMask(cmd), buffer]);
      this.spi.write(wbuf, buf => {
        resolve(buf);
      });
    });
  }
}

module.exports = NodeSPIImpl;
