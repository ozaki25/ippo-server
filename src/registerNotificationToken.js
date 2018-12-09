const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const table = 'Subscriber';

const params = {
  TableName: table,
  Item: {
    token: token,
  },
};

dynamo.put(params, (err, data) => {
  if (err) {
    console.log('dynamo_err:', err);
  } else {
    console.log('dynamo_data:', data);
  }
});
