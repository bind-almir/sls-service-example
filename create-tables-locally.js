const fs = require('fs')
const DynamoDB = require('aws-sdk/clients/dynamodb')
const yaml = require('js-yaml')
const cloudformationSchema = require('@serverless/utils/cloudformation-schema')
const SERVERLESS_CONFIG = __dirname + '/serverless.yml'
const ddb = new DynamoDB({
  accessKeyId: 'fake-key',
  endpoint: 'http://localhost:8001',
  region: 'local',
  secretAccessKey: 'fake-secret',
})
async function getDynamoDBTableResources() {
  const tables = Object.entries(
    yaml.loadAll(fs.readFileSync(SERVERLESS_CONFIG), {
      schema: cloudformationSchema,
    })[0].resources.Resources,
  ).filter(
    ([, resource]) =>
      resource.Type === 'AWS::DynamoDB::Table',
  )
  return tables
};
(async function main() {
  console.info('Setting up local DynamoDB tables');
  const tables = await getDynamoDBTableResources();
  console.info(`Found ${tables.length} tables`);
  const existingTables = (await ddb.listTables().promise())
    .TableNames
  for await ([logicalId, definition] of tables) {
    definition.Properties.TableName = definition.Properties.TableName.replace('${self:provider.stage}', 'dev');
    const {
      Properties: {
        BillingMode,
        TableName,
        AttributeDefinitions,
        KeySchema,
        GlobalSecondaryIndexes,
        LocalSecondaryIndexes,
      },
    } = definition
    if (
      existingTables.find((table) => table === TableName)
    ) {
      console.info(
        `${logicalId}: DynamoDB Local - Table already exists: ${TableName}. Skipping..`,
      )
      continue
    }
    const result = await ddb
      .createTable({
        AttributeDefinitions,
        BillingMode,
        KeySchema,
        LocalSecondaryIndexes,
        GlobalSecondaryIndexes,
        TableName,
      })
      .promise()
    console.info(
      `${logicalId}: DynamoDB Local - Created table: ${TableName}`,
    )
  }
})()