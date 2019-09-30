const addNotificationToken = require('./service/addNotificationToken');
const removeNotificationToken = require('./service/removeNotificationToken');
const addEvent = require('./service/addEvent');
const addOrganizedEvent = require('./service/addOrganizedEvent');
const addTweet = require('./service/addTweet');
const addUser = require('./service/addUser');
const addCategorizedEvent = require('./service/addCategorizedEvent');
const addJoinedEvent = require('./service/addJoinedEvent');
const removeJoinedEvent = require('./service/removeJoinedEvent');
const fetchJoinedEvent = require('./service/fetchJoinedEvent');
const fetchJoinedEvents = require('./service/fetchJoinedEvents');
const fetchOrganizedEvents = require('./service/fetchOrganizedEvents');
const fetchCategorizedEvents = require('./service/fetchCategorizedEvents');
const fetchExternalEvents = require('./service/fetchExternalEvents');
const fetchInternalEvents = require('./service/fetchInternalEvents');
const fetchInternalEvent = require('./service/fetchInternalEvent');
const fetchTweet = require('./service/fetchTweet');
const fetchTweets = require('./service/fetchTweets');
const fetchUser = require('./service/fetchUser');
const publishNotification = require('./service/publishNotification');
const excuteUpdateExternalEvents = require('./service/excuteUpdateExternalEvents');
const utils = require('./utils');
const notificationMessages = require('./constants/notificationMessages');

const resolvers = {
  Query: {
    allEvents: async (_, props) => {
      const [
        joined,
        internal,
        external,
        organized,
        recommended,
      ] = await Promise.all([
        fetchJoinedEvents({ userid: props.uid, ...props }),
        fetchInternalEvents(props),
        fetchExternalEvents(props),
        fetchOrganizedEvents({ userid: props.uid, ...props }),
        (async () => {
          const user = await fetchUser(props.uid);
          return user && user.categories
            ? fetchCategorizedEvents({
                categories: user.categories.split(','),
                ...props,
              })
            : { items: [] };
        })(),
      ]);
      return {
        joined: joined.items,
        internal: internal.items,
        external: external.items,
        organized: organized.items,
        recommended: recommended.items,
      };
    },
    externalEvents: (_, props) => fetchExternalEvents(props),
    internalEvents: (_, props) => fetchInternalEvents(props),
    internalEvent: (_, props) => fetchInternalEvent(props),
    joinedEvents: (_, props) =>
      fetchJoinedEvents({ userid: props.uid, ...props }),
    organizedEvents: (_, props) =>
      fetchOrganizedEvents({ userid: props.uid, ...props }),
    recommendedEvents: async (_, props) => {
      const { categories } = await fetchUser(props.uid);
      return categories
        ? fetchCategorizedEvents({
            categories: categories.split(','),
            ...props,
          })
        : { items: [] };
    },
    tweet: (_, props) => fetchTweet(props),
    tweets: async (_, props) => {
      const [{ tweetList, startId }, event] = await Promise.all([
        fetchTweets(props),
        fetchInternalEvent(props),
      ]);
      const joined = event
        ? await fetchJoinedEvent({ userid: props.uid, eventid: event.id })
        : false;
      return { tweetList, startId, event, joined: !!joined };
    },
    fetchUser: async (_, { uid }) => {
      const user = await fetchUser(uid);
      const notifications =
        user && user.notifications
          ? user.notifications.map(notification => ({
              ...notification,
              title: notificationMessages.find(
                message => message.id === notification.id,
              ).title,
              content: notificationMessages.find(
                message => message.id === notification.id,
              ).content,
            }))
          : [];
      return { ...user, notifications, displayName: 'テスト 太郎' };
    },
  },
  Mutation: {
    registerNotification: (_, { token }) => addNotificationToken(token),
    unregisterNotification: (_, { token }) => removeNotificationToken(token),
    publishNotification: (_, { target }) => publishNotification(target),
    createTweet: async (_, { tweet }) => {
      const { text, uid, parentId, parentHashtag } = tweet;
      if (parentId && parentHashtag) {
        const parentTweet = await fetchTweet({
          id: parentId,
          hashtag: parentHashtag,
        });
        const comments = parentTweet.comments || [];
        return addTweet({
          ...parentTweet,
          comments: [...comments, { ...tweet, id: utils.generateId() }],
        });
      } else {
        const join = utils.joinTweet(text);
        const leave = utils.leaveTweet(text);
        const hashtagList = utils.detectHashtag(text);
        const list = hashtagList.length ? hashtagList : 'none';
        try {
          const actions = hashtagList.map(async hashtag => {
            const event =
              (join || leave) && (await fetchInternalEvent({ hashtag }));
            await Promise.all(
              [
                join &&
                  addJoinedEvent({ ...event, eventid: event.id, userid: uid }),
                leave && removeJoinedEvent({ eventid: event.id, userid: uid }),
                addTweet({ ...tweet, hashtag }),
              ].filter(Boolean),
            );
          });
          await Promise.all(actions);
          return { result: 'OK' };
        } catch (e) {
          return { result: e.toString() };
        }
      }
    },
    createEvent: async (_, { event }) => {
      const { result, id } = await addEvent(event);
      if (result !== 'OK') return { result };
      const promises = event.categories
        .split(',')
        .map(category =>
          addCategorizedEvent({ eventid: id, category, ...event }),
        );
      await Promise.all([
        ...promises,
        addOrganizedEvent({ eventid: id, userid: event.uid, ...event }),
      ]);
      return { result };
    },
    createUser: async (_, { user }) => {
      const stored = await fetchUser(user.uid);
      const notifications =
        stored && stored.notifications
          ? stored.notifications
          : [{ id: '1', checked: false, timestamp: new Date().toString() }];
      return addUser({ ...user, notifications });
    },
    addLikeToTweet: async (_, { uid, hashtag, tweetid }) => {
      const tweet = await fetchTweet({ hashtag, id: tweetid });
      const { likes } = tweet;
      const newLikes = likes
        ? [...likes, uid].filter((v, i, a) => a.indexOf(v) === i)
        : [uid];
      const newTweet = { ...tweet, likes: newLikes };
      return addTweet(newTweet);
    },
    readNotification: async (_, { uid, notificationId }) => {
      const user = await fetchUser(uid);
      const index = user.notifications.findIndex(n => n.id === notificationId);
      user.notifications[index].checked = true;
      return addUser(user);
    },
    excuteUpdateExternalEvents: () => excuteUpdateExternalEvents(),
  },
};

module.exports = resolvers;
