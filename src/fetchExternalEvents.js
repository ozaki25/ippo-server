const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'ExternalEvents';

const params = {
  TableName: tableName,
};

// バグがあるので自前でPromiseをラップし直す
// https://github.com/aws/aws-sdk-js/issues/1453#issuecomment-397649406
// const scan = params =>
//   dynamo.scan(params, function(err, data) {
//     console.log({ data }, { err });
//   });

const scan = params =>
  new Promise((resolve, reject) =>
    dynamo.scan(params, function(err, data) {
      console.log({ data }, { err });
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    }),
  );

async function main() {
  const { Items } = await scan(params);
  return Items;
}

module.exports = main;
