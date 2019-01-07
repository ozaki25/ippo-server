const utils = require('./utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'JoinedEvents';

const params = ({ eventid, userid }) => ({
  TableName: tableName,
  Key: { eventid, userid },
});

const get = params =>
  dynamo.get(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ eventid, userid }) {
  try {
    const { Item } = await get(params({ eventid, userid })).promise();
    return Item;
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
