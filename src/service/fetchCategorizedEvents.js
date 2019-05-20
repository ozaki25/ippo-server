const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'IPPO_CategorizedEvents';

const params = ({ categories, limit = 10, desc = false, startId }) => {
  const categoryExpression = {};
  categories.forEach((c, i) => (categoryExpression[`:c${i}`] = c));
  return {
    TableName: tableName,
    KeyConditionExpression:
      startId === 'init'
        ? 'keyValue = :keyValue and categoryEventId > :categoryEventId'
        : 'keyValue = :keyValue and categoryEventId < :categoryEventId',
    FilterExpression: `category in (${categories.map((_, i) => `:c${i}`).toString()})`,
    ExpressionAttributeValues: {
      ':keyValue': 'categorized',
      ':categoryEventId': startId === 'init' ? '0' : startId,
      ...categoryExpression,
    },
    ScanIndexForward: !desc,
    Limit: limit,
  };
};

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ categories, limit, startId = 'init' }) {
  if (startId === '' || !categories.length) return { items: [], startId: '' };
  const { Items, LastEvaluatedKey } = await query(
    params({ categories, desc: true, limit, startId }),
  ).promise();
  return {
    items: Items.map(item => ({ ...item, id: item.categoryEventId })),
    startId: LastEvaluatedKey ? LastEvaluatedKey.categoryEventId : '',
  };
}

module.exports = main;
