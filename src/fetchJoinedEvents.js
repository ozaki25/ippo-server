const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'JoinedEvents';

const params = ({ userid }) => ({
  TableName: tableName,
  KeyConditionExpression: 'userid = :userid',
  ExpressionAttributeValues: { ':userid': userid },
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ userid }) {
  console.log(params({ userid }));
  const { Items } = await query(params({ userid })).promise();
  return Items;
}

module.exports = main;
