const AWS = require('aws-sdk');
const utils = require('../utils');
const fetchConnpassEvents = require('./fetchConnpassEvents');
const addLastInsertExternalEvent = require('./addLastInsertExternalEvent');
const fetchLastInsertExternalEvent = require('./fetchLastInsertExternalEvent');

const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_ExternalEvents';

const params = event => ({
  TableName: tableName,
  Item: { keyValue: 'external', ...event },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main() {
  try {
    const { events } = await fetchConnpassEvents({ page: 1, count: 100 });
    const lastInsert = (await fetchLastInsertExternalEvent({ key: 1 })) || '';

    let exists = false;
    const newEvents = events
      .filter(event => {
        if (event.event_id === lastInsert.connpassId) exists = true;
        return !exists;
      })
      .reverse();

    await Promise.all([
      ...utils.formatConnpassEvents(newEvents).map(event => put(params({ ...event }))),
      addLastInsertExternalEvent({ key: 1, connpassId: events[0].event_id }),
    ]);
    return 'success';
  } catch (e) {
    console.log(e);
    return JSON.stringify(e);
  }
}

module.exports = main;
