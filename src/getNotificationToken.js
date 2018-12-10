const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const table = 'Subscriber';

const params = {
  TableName: table,
};

const scan = params =>
  dynamo.scan(params, function(err, data) {
    if (err) {
      console.log('getNotificationToken', 'dynamo_err:', { err });
    } else {
      console.log('getNotificationToken', 'dynamo_data:', { data });
    }
  });

async function main(target) {
  if (target === 'all') {
    const { Items } = await scan(params).promise();
    return Items;
  }
}

module.exports = main;
