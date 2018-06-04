
//function _writeMask(value){ return value & ~0x80; }

const CLOCKHZ = 10 * 1000 * 1000; // 125000000

class SpiDevice {
  static init(...id) {
    return new Promise((resolve, reject) => {
      if(id.length !== 2) { reject(Error('incorrect parameters ' + id)); }
      const spiDev = require('spi-device'); // eslint-disable-line global-require

      // explod for id doesn't work with cb params
      const device = spiDev.open(id[0], id[1], { maxSpeedHz: CLOCKHZ}, err => {
        if(err) { reject(err); return; }
        console.log('hi 👍', ...id);
        resolve(new SpiDevice(device, id));
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
    console.log('read', cmdbuf, len);
    const length = len !== undefined ? len : 1;

    const cmd = Array.isArray(cmdbuf) ? cmdbuf : [cmdbuf];

    // explod cmd and pad out length for receive
    const sb = Buffer.from([...cmd, ...new Array(length - cmd.length)]);

    const messages = [{
      sendBuffer: sb,
      byteLength: sb.length,
      receiveBuffer: Buffer.alloc(sb.length),
      speedHz: CLOCKHZ
    }];
    console.log('transfer out', messages)

    return new Promise((resolve, reject) => {
      this._bus.transfer(messages, (err, msg) => {
        console.log('transfer', err, msg);
        if(err) { reject(err); return; }
        resolve(msg[0].receiveBuffer);
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
        resolve(msg[0].receiveBuffer);
      });
    });

    //return Promise.reject(Error('🚭'));
    //return Promise.reject(Error('☢'));
  }
}

module.exports = { SpiDevice };

