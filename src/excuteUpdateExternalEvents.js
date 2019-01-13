const AWS = require('aws-sdk');
const utils = require('./utils');
const fetchConnpassEvents = require('./fetchConnpassEvents');
const addLastInsertExternalEvent = require('./addLastInsertExternalEvent');
const fetchLastInsertExternalEvent = require('./fetchLastInsertExternalEvent');

const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'ExternalEvents';

const params = event => ({
  TableName: tableName,
  Item: { ...event },
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

    utils.formatConnpassEvents(newEvents).forEach(event => put(params({ ...event })));
    addLastInsertExternalEvent({ key: 1, connpassId: events[0].event_id });
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
