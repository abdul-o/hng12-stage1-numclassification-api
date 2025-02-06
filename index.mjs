// Rename your file to index.mjs or add "type": "module" in package.json
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';


const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

/**
 * Check if a number is prime.
 * @param {number} num
 * @returns {boolean}
 */
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2, limit = Math.sqrt(num); i <= limit; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

/**
 * Check if a number is perfect.
 * A perfect number equals the sum of its proper divisors.
 * @param {number} num
 * @returns {boolean}
 */
function isPerfect(num) {
  if (num < 1) return false;
  let sum = 0;
  // Only need to loop to half of the number.
  for (let i = 1; i <= num / 2; i++) {
    if (num % i === 0) sum += i;
  }
  return sum === num;
}

/**
 * Check if a number is an Armstrong number.
 * An Armstrong number is equal to the sum of its own digits each raised to the power of the number of digits.
 * @param {number} num
 * @returns {boolean}
 */
function isArmstrong(num) {
  const strNum = Math.abs(num).toString(); // Use absolute value for proper digit handling.
  const power = strNum.length;
  const sum = strNum.split('').reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
  return sum === Math.abs(num);
}

/**
 * Compute the sum of the digits of a number.
 * @param {number} num
 * @returns {number}
 */
function digitSum(num) {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((acc, digit) => acc + Number(digit), 0);
}

/**
 * GET /api/classify-number?number=371
 * Returns a JSON response with the number's properties and a fun fact.
 */
app.get('/api/classify-number', async (req, res) => {
  const { number: numberParam } = req.query;

  // Input validation: Must be a valid integer.
  if (!numberParam || isNaN(numberParam) || !/^-?\d+$/.test(numberParam)) {
    return res.status(400).json({
      number: numberParam,
      error: true
    });
  }

  const number = parseInt(numberParam, 10);

  // Determine mathematical properties.
  const prime = isPrime(number);
  const perfect = isPerfect(number);
  const armstrong = isArmstrong(number);
  const ds = digitSum(number);
  const parity = number % 2 === 0 ? 'even' : 'odd';

  // Set the "properties" array based on whether the number is Armstrong.
  let properties = armstrong ? ['armstrong', parity] : [parity];

  // Fetch a fun fact from the Numbers API using the "math" category.
  let funFact = '';
  try {
    // The Numbers API returns plain text by default.
    const response = await fetch(`http://numbersapi.com/${number}/math`);
    funFact = await response.text();
  } catch (error) {
    funFact = "Fun fact not available";
  }

  // Return the JSON response.
  return res.status(200).json({
    number,
    is_prime: prime,
    is_perfect: perfect,
    properties,
    digit_sum: ds,
    fun_fact: funFact
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
