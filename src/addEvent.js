const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'InternalEvents';

const generateId = () =>
  [...Array(8)]
    .map(() =>
      Math.random()
        .toString(36)
        .slice(-8),
    )
    .join('');

const params = event => ({
  TableName: tableName,
  Item: { id: generateId(), ...event },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(event) {
  try {
    const response = await put(params(event)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
