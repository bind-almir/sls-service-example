// no need to include aws-sdk into package.json it's already part of lambda environment
const { DynamoDB } = require('aws-sdk');

const dynamo = new DynamoDB({ region: process.env.REGION });
const docClient = new DynamoDB.DocumentClient({
  service:
    typeof process.env.AWS_ACCESS_KEY_ID === 'undefined'
      ? new DynamoDB({
          accessKeyId: 'fake-key',
          endpoint: 'http://localhost:8001',
          region: 'local',
          secretAccessKey: 'fake-secret',
        })
      : new DynamoDB()
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
const createTable = async (params) => {
  const { TableName, KeySchema, AttributeDefinitions, ProvisionedThroughput } = params;
  return await dynamo.createTable( { TableName, KeySchema, AttributeDefinitions, ProvisionedThroughput } ).promise();
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
const deleteTable = async (TableName) => await dynamo.deleteTable({ TableName }).promise();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
const putItem = async (TableName, Item) => await docClient.put({ TableName, Item }).promise();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
const getItem = async (TableName, Key) => await docClient.get({ TableName, Key }).promise();

const queryItemByIndex = async(query) => await docClient.query(query).promise();

const scan = async(query) => await docClient.scan(query).promise();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property
const deleteItem = async (TableName, Key) => await docClient.delete({ TableName, Key }).promise();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#tableNotExists-waiter
const waitFor = async (what, TableName) => await dynamo.waitFor(what, { TableName }).promise();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
const describeTable = async (TableName) => await dynamo.describeTable({ TableName }).promise();

const unmarshall = newImage => DynamoDB.Converter.unmarshall(newImage);

module.exports = { 
  unmarshall,
  createTable, 
  deleteTable, 
  describeTable,
  waitFor,
  putItem, 
  getItem, 
  scan,
  queryItemByIndex, 
  deleteItem  
}