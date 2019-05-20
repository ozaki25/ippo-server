const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'IPPO_JoinedEvents';

const params = ({ userid, limit = 10, desc = false, startId }) => ({
  TableName: tableName,
  KeyConditionExpression:
    startId === 'init' ? 'userid = :userid' : 'userid = :userid and eventid < :eventid',
  ScanIndexForward: !desc,
  ExpressionAttributeValues: {
    ':userid': userid,
    ...(startId === 'init' ? {} : { ':eventid': startId }),
  },
  Limit: limit,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ userid, limit, startId = 'init' }) {
  if (startId === '') return { items: [], startId: '' };
  const { Items, LastEvaluatedKey } = await query(
    params({ userid, desc: true, limit, startId }),
  ).promise();
  return {
    items: Items.map(item => ({ ...item, id: item.eventid })),
    startId: LastEvaluatedKey ? LastEvaluatedKey.eventid : '',
  };
}

module.exports = main;
