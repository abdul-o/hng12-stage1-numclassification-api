const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Function to check if a number is perfect
const isPerfect = (num) => {
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num) => {
  const digits = num.toString().split("");
  const power = digits.length;
  const sum = digits.reduce((acc, d) => acc + Math.pow(Number(d), power), 0);
  return sum === num;
};

// Function to get the sum of digits
const getDigitSum = (num) => {
  return num.toString().split("").reduce((acc, d) => acc + Number(d), 0);
};

// API Route
app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;
  const num = parseInt(number, 10);

  // Validate input
  if (isNaN(num)) {
    return res.status(400).json({
      number,
      error: true,
    });
  }

  // Determine properties
  const properties = [];
  if (num % 2 !== 0) properties.push("odd");
  else properties.push("even");

  if (isArmstrong(num)) properties.push("armstrong");
  if (isPrime(num)) properties.push("prime");
  if (isPerfect(num)) properties.push("perfect");

  // Get fun fact from numbersapi.com
  let funFact = "";
  try {
    const response = await axios.get(`http://numbersapi.com/${num}`);
    funFact = response.data;
  } catch (error) {
    funFact = "No fun fact available.";
  }

  // Send response
  res.json({
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties,
    digit_sum: getDigitSum(num),
    fun_fact: funFact,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
