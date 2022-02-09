const response = require('../helpers/parse-response');
const { putItem } = require('../helpers/dynamo');

const handler = async event => { 
  try {
    const { pk, sk } = JSON.parse(event.body);
    
    if(!pk) throw {
      statusCode: 400,
      message: 'pk is required'
    }

    if(!sk) throw {
      statusCode: 400,
      message: 'sk is required'
    }

    const TableName = `sls-service-example-${process.env.STAGE}`;

    await putItem(TableName, { 
      pk, 
      sk
    });

    return response(201, { message: 'success' });
    
  } catch (error) {
    console.log(error);
    const { statusCode, message } = error;
    return response(statusCode || 500, { message: message || 'Internal server error' });
  }
}

module.exports = { handler }