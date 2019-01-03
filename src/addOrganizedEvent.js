const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'OrganizedEvents';

const params = ({ uid, eventid }) => ({
  TableName: tableName,
  Item: { uid, eventid },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(props) {
  try {
    await put(params(props)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
