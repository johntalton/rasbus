const onoff = require('onoff');

/**
 *
 **/
class OnOffIPromise {
  static exportGpio(pin, options) {
     try {
      const gpio = new onoff.Gpio(
        pin,
        options.direction,
        options.edge,
        { activeLow: options.activeLow });

      return Promise.resolve(OnOffIPromise.adoptOnOff(gpio));
    }
    catch(e) {
      console.log('err', e);
      // todo
      return Promise.reject(e);
    }
  }

  static adoptOnOff(gpio) {
    console.log('adopting onoff gpio');
    return new OnOffIPromise(gpio);
  }

  constructor(gpio) {
    this.gpio = gpio;
  }

  write(value) {
    return new Promise((resolve, reject) => {
      this.gpio.write(value, (err) => {
        if(err) { reject(err); return; }
        resolve();
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      this.gpio.read((err, value) => {
        if(err) { reject(err); return; }
        resolve(value);
      });
    });
  }

  watch(cb) {
    this.gpio.watch(cb);
    return Promise.resolve();
  }

  unexport() {
    //
    return Promise.reject(Error('unexport'));
  }
}

module.exports = { OnOffIPromise };
