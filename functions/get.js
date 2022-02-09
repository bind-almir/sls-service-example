const { queryItemByIndex } = require("../helpers/dynamo");
const response = require("../helpers/parse-response");

const handler = async event => { 

  try {
    
    const { pk, sk } = event.pathParameters;
    
    if(!pk) throw {
      statusCode: 400,
      message: 'pk is required'
    }

    if(!sk) throw {
      statusCode: 400,
      message: 'sk is required'
    }

    const TableName = `sls-service-example-${process.env.STAGE}`;
    const params = {
      TableName,
      KeyConditionExpression: 'pk = :pk and #sk = :sk',      
      ExpressionAttributeNames:{
        "#sk": "sk"
      },
      ExpressionAttributeValues: {
        ':pk': pk,
        ':sk': sk
      }
    };

    const { Items } = await queryItemByIndex(params);  
    const item = Items.length > 0 ? Items[0] : {}
    return response(200, item);
  } catch (error) {
    console.log(error);
    const { statusCode, message } = error;
    return response(statusCode || 500, { message: message || 'Internal server error' });
  }
}

module.exports = { handler }