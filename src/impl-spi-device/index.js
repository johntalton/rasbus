
//function _writeMask(value){ return value & ~0x80; }

class SpiDeviceImpl {
  static init(...id) {
    //console.log('hi 👍');

    return new Promise((resolve, reject) => {
      if(id.length !== 2) { throw Error('incorrect parameters ' + id); }
      const spiDev = require('spi-device'); // eslint-disable-line global-require

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
    return new Promise(resolve => {
      this._bus.close(() => { resolve(); });
    });
  }

  read(cmd, len) {
    //console.log('read', cmd, length);
    const length = len !== undefined ? len : 1;

    // explod cmd and pad out length for receive
    const sb = Buffer.from([...cmd, ...new Array(length)]);

    const messages = [{
      sendBuffer: sb,
      byteLength: sb.length,
      receiveBuffer: Buffer.alloc(sb.length),
      speedHz: 20000 // 125000000 // todo move this to .init
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

