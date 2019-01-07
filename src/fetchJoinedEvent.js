const utils = require('./utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'JoinedEvents';

const params = ({ eventid, uid }) => ({
  TableName: tableName,
  KeyConditionExpression: 'eventid = :eventid and uid = :uid',
  ExpressionAttributeValues: { ':eventid': eventid, ':uid': uid },
  Limit: 1,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ eventid, uid }) {
  try {
    const { Items } = await query(params({ eventid, uid })).promise();
    return Items[0];
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
