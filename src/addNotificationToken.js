const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const table = 'Subscriber';

const params = token => ({
  TableName: table,
  Item: { token },
});

const put = params =>
  dynamo.put(params, (err, data) => {
    if (err) {
      console.log('dynamo_err:', { err });
    } else {
      console.log('dynamo_data:', { data });
    }
  });

function main(token) {
  console.log(token);
  return put(params(token));
}

module.exports = main;
