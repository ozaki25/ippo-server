const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'InternalEvents';

const generateId = () => Date.now().toString();

const params = event => ({
  TableName: tableName,
  Item: { id: generateId(), ...event },
});

const put = params =>
  dynamo.put(params, (err, data) => {
    console.log({ data }, { err });
  });

async function main(event) {
  const { response } = await put(params(event));
  console.log(response.error);
  return { result: response.error || 'OK' };
}

module.exports = main;
