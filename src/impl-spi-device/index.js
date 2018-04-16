"use strict";

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
        impl._name = 'spi-device:' + id.join(','); // construct here as driver is sealed and we cant get from it
        impl._bus = device;
        resolve(impl);
      });
    });
  }

  get name() {
    return this._name;
  }

  close() {
    return new Promise((resolve, reject) => {
      this._bus.close(() => { resolve(); });
    });
  }

  read(cmd, length) {
    if(length === undefined){ length = 1; }

    const messages = [{
      sendBuffer: Buffer.from([cmd, ...(new Array(length))]),
      byteLength: length + 1,
      receiveBuffer: Buffer.alloc(length + 1),
      speedHz: 20000 // 125000000
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
      speedHz: 20000 // 125000000
    }];

    return new Promise((resolve, reject) => {
      this._bus.transfer(messages, (err, msg) => {
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

