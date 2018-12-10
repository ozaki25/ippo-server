const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const table = 'Subscriber';

const params = {
  TableName: table,
};

const scan = params =>
  dynamo.scan(params, function(err, data) {
    if (err) {
      console.log('dynamo_err:', { err });
    } else {
      console.log('dynamo_data:', { data });
      return data;
    }
  });

function main(target) {
  if (target === 'all') {
    const {
      data: { items },
    } = scan(params);
    return items;
  }
  return;
}

module.exports = main;
