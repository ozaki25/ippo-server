const serverKey = process.env.SERVER_KEY;

const topicName = 'ippo';

const registerTopicUrl = token =>
  `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topicName}`;

const publishUrl = 'https://fcm.googleapis.com/fcm/send';

const headersOption = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${serverKey}`,
  },
};

const notificationContents = {
  notification: {
    title: '新着イベント',
    body: '新しい勉強会が公開されています',
    click_action: 'http://ippo.netlify.com/#/events/',
    icon: 'https://ippo.netlify.com/icon.png',
  },
};

const destination = {
  to: `/topics/${topicName}`,
};

const options = {
  ...headersOption,
};

const params = {
  ...notificationContents,
  ...destination,
};

module.exports = {
  serverKey,
  topicName,
  publishUrl,
  registerTopicUrl,
  options,
  params,
};
