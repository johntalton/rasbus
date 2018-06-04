
const Util = require('util');

/**
 *
 **/
class OnOffIPromise {
  static exportGpio(pin, options) {
    // try { const gpio = new onoff.Gpio(
    return OnOffIPromise.adoptGpio(gpio);
  }

  static adoptGpio(gpio) {
    return Promise.resolve(new OnOffIPromise(gpio));
  }

  constructor(gpio) {
    this.gpio = gpio;
  }

  write(value) {
    const pw =  Util.promisify(this.gpio.write);
    return pw(value);
  }

  read() {
    const pr = Util.promisify(this.gpio.read);
    return pr();
  }

  unexport() {
    //
  }
}

module.exports = { OnOffIPromise };
