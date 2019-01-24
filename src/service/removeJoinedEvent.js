const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'JoinedEvents';

const params = ({ userid, eventid }) => ({
  TableName: tableName,
  Key: { userid, eventid },
});

const _delete = params =>
  dynamo.delete(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(props) {
  try {
    await _delete(params(props)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
