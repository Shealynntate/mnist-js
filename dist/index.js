(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const DEFAULT_TRAIN_COUNT = 60000;
const DEFAULT_TEST_COUNT = 10000;
const DEFAULT_INCLUDED_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 28;

class MNIST {

  constructor(options={}) {

    let {trainCount, testCount, includedDigits, batchSize} = options;
    
    trainCount = trainCount || DEFAULT_TRAIN_COUNT;
    testCount = testCount || DEFAULT_TEST_COUNT;
    includedDigits = includedDigits || DEFAULT_INCLUDED_DIGITS;

    // Check that the input options are valid
    if (trainCount < 0 || trainCount > DEFAULT_TRAIN_COUNT) {
      trainCount = DEFAULT_TRAIN_COUNT;
      console.warn(`[MNIST] trainCount must be a value between 0 and ${DEFAULT_TRAIN_COUNT}. Setting to ${trainCount}`);
    }
    if (testCount < 0 || testCount > DEFAULT_TEST_COUNT) {
      testCount = DEFAULT_TEST_COUNT;
      console.warn(`[MNIST] testCount must be a value between 0 and ${DEFAULT_TEST_COUNT}. Setting to ${testCount}`);
    }
    // Only the digits 0-9 are allowed
    includedDigits = includedDigits.filter(digit => DEFAULT_INCLUDED_DIGITS.includes(digit));
    // Check that the batchSize isn't larger than the number of training samples
    this._batchSize = Math.min(batchSize || 100, trainCount);
    if (batchSize && this._batchSize < batchSize) {
      console.warn(`[MNIST] Specified batchSize ${batchSize} was larger than available training samples, setting it to ${this._batchSize}`);
    }

    // Create test and train sample pools that only contain includedDigits
    this._trainSamplePool = this._formSamplePool('train', includedDigits);
    this._testSamplePool = this._formSamplePool('test', includedDigits);
    // Choose the specified number of samples from each pool
    this.trainSamples = this._createSamples(this._trainSamplePool, trainCount);
    this.testSamples = this._createSamples(this._testSamplePool, testCount);

    this._batchIndex = 0;
    this._testIndex = 0;
  }

  getDigit(digit, count=1) {
    if (digit < 0 || digit >= DEFAULT_INCLUDED_DIGITS.length) {
      console.error(`[MNIST] Provided digit must be between 0 and ${DEFAULT_INCLUDED_DIGITS.length}.`);
      return;
    }

    const list = this._getAssets('train')[digit];

    return this._createSamples(list, Math.min(count, list.length));
  }

  drawDigit(pixels, ctx, startX=0, startY=0, scale=1) {
    pixels.forEach((pixel, index) => {
      let row = IMAGE_SIZE + Math.trunc(index/IMAGE_SIZE) - 1;
      let xOffset = index % IMAGE_SIZE;
      let x = startX + xOffset * scale;
      let y = startY + row * scale;

      ctx.fillStyle = `rgb(${255*pixel},${255*pixel},${255*pixel})`;
      ctx.fillRect(x, y, scale, scale);
    });
  }

  // Training Methods
  // ------------------------------------------------------------
  hasBatch() {
    return this._batchIndex < this.trainSamples.length;
  }

  // Return an array of the next batch of samples or null if there are no more.
  nextBatch() {
    if (!this.hasBatch()) {
      return null;
    }

    const end = Math.min(this._batchIndex + this._batchSize, this.trainSamples.length);
    const batch = this.trainSamples.slice(this._batchIndex, end);
    this._batchIndex = end;

    return batch;
  }

  resetBatches() {
    this._batchIndex = 0;
  }

  // Test Methods
  // ------------------------------------------------------------
  hasTest() {
    return this._testIndex < this.testSamples.length;
  }

  nextTest() {
    if (!hasTest()) {
      return null;
    }

    return this.testSamples[this._testIndex++];
  }

  resetTest() {
    this._testIndex = 0;
  }

  // Private Helper Methods
  // ------------------------------------------------------------
  _formSamplePool(type, includedDigits) {
    let samples = [];
    const assets = this._getAssets(type);
    includedDigits.forEach(digit => {
      let answer = new Array(DEFAULT_INCLUDED_DIGITS.length).fill(0);
      answer[digit] = 1;
      assets[digit].forEach(image => {
        samples.push({input: image, output: answer});
      });
    });

    return samples;
  }

  _createSamples(samplePool, total) {
    let source = samplePool.slice();
    let result = [];
    while (total > 0) {
      let index = this._randIndex(source);
      result.push(source.splice(index, 1)[0]);
      total--;
    }

    return result;
  }

  _getAssets(type) {
    return [
      require(`./assets/${type}-digits/0.json`),
      require(`./assets/${type}-digits/1.json`),
      require(`./assets/${type}-digits/2.json`),
      require(`./assets/${type}-digits/3.json`),
      require(`./assets/${type}-digits/4.json`),
      require(`./assets/${type}-digits/5.json`),
      require(`./assets/${type}-digits/6.json`),
      require(`./assets/${type}-digits/7.json`),
      require(`./assets/${type}-digits/8.json`),
      require(`./assets/${type}-digits/9.json`)
    ];
  }

  _randIndex(array) {
    return Math.floor(Math.random() * Math.floor(array.length));
  }
}

// ------------------------------------------------------------
// ------------------------------------------------------------

// Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MNIST;
}

// Browser
if (typeof window == 'object') {
  window['mnist'] = MNIST;
}
},{}]},{},[1]);
