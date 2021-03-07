
MNIST Digits
============

This library provides easy access to the [MNIST Handwritten Digits](http://yann.lecun.com/exdb/mnist/) dataset to test and train neural networks in Javascript. It can work directly in browser or through node.js.

The training set can include up to 60,000 digits and the test set up to 10,000. You can also limit the digits included as well (e.g. creating training and test sets with just the numbers 1 and 2 for easier debugging).

# Installation

for node.js: `npm install mnist-javascript --save`

for the browser: `bower install mnist-javascript --save`

# Usage

To use, construct an instance of the `MNIST` class. All functionality is accessed through this class.

## Constructor

```javascript
// All parameters set to default values
const mnist = new MNIST();

// Specifying all parameters to custom values
const mnist = new MNIST({trainCount: 30000, testCount: 5000, includedDigits: [1, 3, 5], batchSize: 10});
```
### Parameters

`trainCount [optional]: number` 

- The number (between 0 and 60,000) of digit samples you want in your training set, chosen randomly.
- `default = 60,000`

`testCount [optional]: number` 
- The number (between 0 and 10,000) of digit samples you want in your test set, chosen randomly. 
- `default = 10,000`

`includedDigits [optional]: number[]`
- The digits you want included in your sets (e.g. [1,3,5,7,9] if you just wanted odd digits to train and test with)
- Note: Specifying a subset of digits means the number of total samples you'll have access to will decrease.
- `default = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`

`batchSize [optional]: number`
- The number of samples in each training batch (see batches below)
- `default = 100`

## Sample Structure
Each training and test sample is a basic object with two keys:
- `input` : 784 grayscale pixel values (normalized)
- `output` : an array of length 10 with a `1` in the spot corresponding to the label for the digit
```javascript
const threeSample = {
  input: [0, 0.5, 0.3, ..., 0.8, 1, 0, 0],  // 784 values, one for each pixel
  output: [0, 0, 0, 1, 0, 0, 0, 0, 0]  // since this sample is a three, it has a 1 at that index
};
```
## Training Functionality
### Properties
`trainSamples: Sample[]` All the training samples in random order (ignores batching)
  ### Methods
`nextBatch()` - returns a `Sample[]` of the next batch, of length `batchSize` or `null` if no batches remain.

`hasBatch()` - returns `true` if there are still batches to iterate over, `false` otherwise.

`resetBatches()` - resets the internal batch index so calling `nextBatch()` will start over with the first training batch.

## Testing Functionality
`testSamples: Sample[]` All the test samples in random order
 ### Methods
`nextTest()` - returns the next test as a `Sample` or `null` if no tests remain.

`hasTest()` - returns `true` if there are still tests to iterate over, `false` otherwise.

`resetTests()` - resets the internal test index so calling `nextTest()` will start over with the first `Sample`.

## Example Use Cases
1. Construct a MNIST instance to test and train your NN using batches

```javascript
const network = new NeuralNetwork(); // example of a NN class to train and test
const mnist = new mnist();

// Train network by running through all batches
while (mnist.hasBatch()) {
  let batch = mnist.nextBatch();
  network.train(batch);
}

// Test the network
network.test(mnist.testSamples);
```
2. Construct a MNIST instance to test and train your NN without batches
```javascript
const network = new NeuralNetwork(); // example of a NN class to train and test
const mnist = new mnist({trainCount: 55000});

// Train using all training samples at once
network.train(mnist.trainingSamples);

// Test the network
network.test(mnist.testSamples);
```
3. Construct a MNIST instance and iterate over test samples
```javascript
const network = new NeuralNetwork(); // example of a NN class to train and test
const mnist = new mnist({trainingCount: 55000});

// Train using all training samples at once
network.train(mnist.trainingSamples);

// Test the network
while (mnist.hasTest()) {
	network.testSingleSample(mnist.nextTest());
}
```
# Helper Functionality
## Get Specific Digits
You can grab a specified number of samples of a particular digit (randomly chosen from the training set)
```javascript
const mnist = new mnist();
const digit = 5;
const count = 2;

const samples = mnist.getDigit(digit, count);
```
### Parameters
`digit: number` The digit you want samples of (between 0 and 9)

`count [optional]: number` The number of samples you want (defaults to 1)

`return:` An array of `count` samples.

## Draw A Digit (Browser Only)

You can have MNIST render a sample digit to an HTML canvas if you provide the canvas context.
```javascript
const mnist = new mnist();
const ctx = window.getElementById("myCanvas").getContext('2d'); // grab a canvas element
const sampleThree = mnist.getDigit(3)[0]; // grab a random sample 3 to render

mnist.drawDigit(sampleThree.input, ctx);
```
### Parameters
`pixels: number[]` An array of 784 pixel values to render (the `input` of a sample)

`ctx: CanvasRenderingContext2D` A canvas rendering context, can get using `getContext(2d)`

`x [optional]: number` X offset into the canvas for the image

`y [optional]: number` Y offset into the canvas for the image

# License

[MIT](https://choosealicense.com/licenses/mit/)
