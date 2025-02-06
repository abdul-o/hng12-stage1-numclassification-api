# Number Properties API

This is a JavaScript-based API that takes a number as input and returns its mathematical properties along with a fun fact.

## API Endpoint

**GET** `(https://hng12-stage1-numclassification-api.vercel.app/api/classify-number?number=<number>)`

## Response Format (200 OK)

```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["odd", "armstrong"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
