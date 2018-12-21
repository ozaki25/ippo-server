const serverKey = process.env.SERVER_KEY;

const topicName = 'ippo';

const notificationContents = {
  notification: {
    title: '新着イベント',
    body: '新しいイベントが公開されています',
    click_action: 'http://ippo.netlify.com/',
    icon: 'https://ippo.netlify.com/icon.png',
  },
};

const destination = {
  to: `/topics/${topicName}`,
};

const headersOption = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${serverKey}`,
  },
};

const register = {
  url: token => `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topicName}`,
  params: {},
  options: {
    ...headersOption,
  },
};

const publish = {
  url: 'https://fcm.googleapis.com/fcm/send',
  params: {
    ...notificationContents,
    ...destination,
  },
  options: {
    ...headersOption,
  },
};

module.exports = {
  register,
  publish,
};
