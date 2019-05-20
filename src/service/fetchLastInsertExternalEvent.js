const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_LastInsertExternalEvent';

const params = ({ key }) => ({
  TableName: tableName,
  Key: { key },
});

const get = params =>
  dynamo.get(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(props) {
  try {
    const { Item } = await get(params(props)).promise();
    return Item;
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
