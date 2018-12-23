const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'Tweets';

const params = ({ limit = 10, desc = false, hashtag = 'none', startId = null }) => ({
  TableName: tableName,
  KeyConditionExpression: startId ? 'hashtag = :hashtag and id < :id' : 'hashtag = :hashtag',
  ExpressionAttributeValues: {
    ':hashtag': hashtag,
    ...(startId ? { ':id': startId } : {}),
  },
  ScanIndexForward: !desc,
  Limit: limit,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ hashtag, limit, startId }) {
  const { Items } = await query(params({ hashtag, desc: true, limit, startId })).promise();
  return Items;
}

module.exports = main;
