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

const registrationTokens = tokens => ({
  registration_tokens: [...tokens],
});

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

const unregister = {
  // こっちはtokenの無効化だから全topic解除される
  // url: token => `https://iid.googleapis.com/v1/web/iid/${token}`,
  url: token => `https://iid.googleapis.com/iid/v1:batchRemove`,
  params: token => ({
    ...destination,
    ...registrationTokens([token]),
  }),
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
  unregister,
  publish,
};
