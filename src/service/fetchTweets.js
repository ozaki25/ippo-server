const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'Tweets';

const params = ({ limit = 10, desc = false, hashtag = 'none', startId = null }) => ({
  TableName: tableName,
  KeyConditionExpression:
    startId === 'init' ? 'hashtag = :hashtag' : 'hashtag = :hashtag and id < :id',
  ExpressionAttributeValues: {
    ':hashtag': hashtag,
    ...(startId === 'init' ? {} : { ':id': startId }),
  },
  ScanIndexForward: !desc,
  Limit: limit,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ hashtag, limit, startId = 'init' }) {
  if (startId === '') return { tweetList: [], startId: '' };
  const { Items, LastEvaluatedKey } = await query(
    params({ hashtag, desc: true, limit, startId }),
  ).promise();
  return { tweetList: Items, startId: LastEvaluatedKey ? LastEvaluatedKey.id : '' };
}

module.exports = main;
