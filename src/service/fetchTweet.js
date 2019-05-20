const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_Tweets';

const params = ({ hashtag, id }) => ({
  TableName: tableName,
  Key: { hashtag, id },
});

const get = params =>
  dynamo.get(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ hashtag, id }) {
  try {
    const { Item } = await get(params({ hashtag, id })).promise();
    return Item;
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
