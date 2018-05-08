
//function _writeMask(value){ return value & ~0x80; }

const CLOCKHZ = 5 * 1000 * 1000; // 125000000

class SpiDeviceImpl {
  static init(...id) {
    console.log('hi 👍', id);

    return new Promise((resolve, reject) => {
      if(id.length !== 2) { reject(Error('incorrect parameters ' + id)); }
      const spiDev = require('spi-device'); // eslint-disable-line global-require

      // explod for id doesn't work with cb params
      const device = spiDev.open(id[0], id[1], err => {
        if(err) { reject(err); return; }
        resolve(new SpiDeviceImpl(device, id));
      });
    });
  }

  constructor(bus, id) {
    this._bus = bus;
    this._name = 'spi-device:' + id.join('.');
  }

  get name() {
    return this._name;
  }

  close() {
    console.log('closing spi-device bus');
    return new Promise(resolve => {
      this._bus.close(() => { resolve(); });
    });
  }

  read(cmdbuf, len) {
    //console.log('read', cmd, length);
    const length = len !== undefined ? len : 1;

    const cmd = Array.isArray(cmdbuf) ? cmdbuf : [cmdbuf];

    // explod cmd and pad out length for receive
    const sb = Buffer.from([...cmd, ...new Array(length)]);

    const messages = [{
      sendBuffer: sb,
      byteLength: sb.length,
      receiveBuffer: Buffer.alloc(sb.length),
      speedHz: CLOCKHZ
    }];

    return new Promise((resolve, reject) => {
      this._bus.transfer(messages, (err, msg) => {
        if(err) { reject(err); return; }
        const out = Buffer.alloc(length);
        msg[0].receiveBuffer.copy(out, 0, 1); // trim first byte
        resolve(out);
      });
    });
  }

  write(cmd, buffer) {
    //console.log(cmd, buffer);

    const length = 1;
    const rbuf = Buffer.alloc(length + 1);

    const messages = [{
      sendBuffer: Buffer.from([cmd, buffer]),
      byteLength: length + 1,
      receiveBuffer: rbuf,
      speedHz: CLOCKHZ
    }];

    return new Promise((resolve, reject) => {
      this._bus.transfer(messages, (err, msg) => {
        //console.log(err, msg);
        if(err) { reject(err); return; }
        const out = Buffer.alloc(length);
        msg[0].receiveBuffer.copy(out, 0, 1); // trim first byte
        resolve(out);
      });
    });

    //return Promise.reject(Error('🚭'));
    //return Promise.reject(Error('☢'));
  }
}

module.exports = SpiDeviceImpl;

