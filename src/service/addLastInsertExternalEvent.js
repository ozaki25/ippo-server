const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_LastInsertExternalEvent';

const params = props => ({
  TableName: tableName,
  Item: { ...props },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(props) {
  try {
    await put(params(props)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
