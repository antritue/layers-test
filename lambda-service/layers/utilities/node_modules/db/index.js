const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({
  // region: "localhost",
  // endpoint: "http://localhost:8000",
});

module.exports = client;
