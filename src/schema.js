const isLocal = process.env.LOCAL;
const { gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    allEvents(uid: String, limit: Int): AllEvents
    externalEvents(limit: Int, startId: String): Events
    internalEvents(limit: Int): Events
    internalEvent(hashtag: String): Event
    joinedEvents(uid: String, limit: Int, startId: String): Events
    organizedEvents(uid: String, limit: Int, startId: String): Events
    recommendedEvents(uid: String, limit: Int, startId: String): Events
    tweet(hashtag: String, id: String): Tweet
    tweets(hashtag: String, limit: Int, startId: String, uid: String): Tweets
    fetchUser(uid: String): User
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    unregisterNotification(token: String): Unsubscribe
    publishNotification(target: String): Publish
    createEvent(event: inputEvent): CreateEvent
    createTweet(tweet: inputTweet): CreateTweet
    createUser(user: inputUser): CreateUser
    addLikeToTweet(uid: String, hashtag: String, tweetid: String): AddLikeToTweet
    readNotification(uid: String, notificationId: String): ReadNotification
    excuteUpdateExternalEvents: String
  }
  type AllEvents {
    joined: [Event]
    recommended: [Event]
    internal: [Event]
    external: [Event]
    organized: [Event]
  }
  type Events {
    items: [Event]
    startId: String
  }
  type Event {
    id: String
    connpassId: Int
    title: String
    eventUrl: String
    catchMessage: String
    place: String
    hashtag: String
    startedAt: String
    endedAt: String
    name: String
    timestamp: String
  }
  type Tweets {
    tweetList: [Tweet]
    startId: String
    event: Event
    joined: Boolean
  }
  type Tweet {
    id: String
    hashtag: String
    name: String
    uid: String
    text: String
    time: String
    comments: [Tweet]
    likes: [String]
  }
  type User {
    uid: String
    displayName: String
    categories: String
    notifications: [Notification]
  }
  type Notification {
    id: String
    checked: Boolean
    title: String
    content: String
    timestamp: String
  }
  type Subscribe {
    result: String
  }
  type Unsubscribe {
    result: String
  }
  type Publish {
    result: String
  }
  type CreateEvent {
    result: String
  }
  type CreateTweet {
    result: String
  }
  type CreateUser {
    result: String
  }
  type AddLikeToTweet {
    result: String
  }
  type ReadNotification {
    result: String
  }
  input inputEvent {
    uid: String
    name: String
    title: String
    catchMessage: String
    place: String
    hashtag: String
    categories: String
    startedAt: String
    endedAt: String
  }
  input inputTweet {
    name: String
    uid: String
    text: String
    time: String
    parentId: String
    parentHashtag: String
  }
  input inputUser {
    uid: String
    displayName: String
    categories: String
  }
`;

module.exports = typeDefs;
