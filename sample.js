const addTweet = require('./src/addTweet');
const addOrganizedEvent = require('./src/addOrganizedEvent');
const addJoinedEvent = require('./src/addJoinedEvent');
const removeJoinedEvent = require('./src/removeJoinedEvent');
const fetchJoinedEvent = require('./src/fetchJoinedEvent');
const fetchJoinedEvents = require('./src/fetchJoinedEvents');
const fetchTweets = require('./src/fetchTweets');
const fetchUser = require('./src/fetchUser');
const fetchInternalEvent = require('./src/fetchInternalEvent');
const fetchExternalEventa = require('./src/fetchExternalEvents');

const tweets = [
  {
    name: 'ozaki25',
    text: `Template必要なのか
たしかに使ってない
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `コンポーネント指向
- 見た目と機能をカプセル化
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `PagesとOrganismsどの単位でReduxをConnectするか
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `AtomicDesignはベースにすぎなくてプロジェクトごとに柔軟に変えていくことも必要
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `これかな
http://atomicdesign.bradfrost.com/chapter-4/ 
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `不必要にコンポーネント化しすぎた
AtomicDesignあるあるだと思う
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `Storybookいいところ
- どんなコンポーネントが存在してるか可視化できる
- コンポーネントの扱い方が分かる
- UIの修正デバッグが楽
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `コンポーネントマネージャー
- コンポーネントの管理に責任を持つ人
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
  {
    name: 'ozaki25',
    text: `PagesとOrganisms以外は状態を持たせない
- それ以外のコンポーネントはステートレスなので簡単に作れる
- Reduxみたいなところはフロントエンドエンジニアにまかせる
#ThinkAtomicDesign`,
    time: new Date().toString(),
    hashtag: 'ThinkAtomicDesign',
  },
];

async function main() {
  // tweets.forEach(async tweet => {
  //   tweet.time = new Date().toString();
  //   await new Promise(resolve => setTimeout(() => resolve(), 1000));
  //   addTweet(tweet);
  // });
  // addTweet(tweets[0]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[1]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[2]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[3]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[4]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[5]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[6]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[7]);
  // await new Promise(resolve => setTimeout(() => resolve(), 1000));
  // addTweet(tweets[8]);
  //
  // const result = await fetchTweets({
  //   limit: 5,
  //   hashtag: 'test',
  //   desc: true,
  //   startId: '1545660970464',
  // });
  // console.log(result);
  // const result = await fetchUser('qD1tFr2UvpXMTrk5sjfITDDTQTG2');
  // console.log('################');
  // console.log(result);
  // console.log('################');
  // console.log(await addOrganizedEvent({ userid: '456', eventid: '789' }));
  // console.log('##########', await fetchInternalEvent({ hashtag: 'test' }));
  // console.log('##########', await addJoinedEvent({ userid: '123', eventid: 'abc' }));
  // console.log('##########', await addJoinedEvent({ userid: '123', eventid: 'def' }));
  // console.log('##########', await addJoinedEvent({ userid: '456', eventid: 'abc' }));
  // console.log('##########', await removeJoinedEvent({ userid: '123', eventid: 'abc' }));
  // console.log('##########', await fetchJoinedEvent({ userid: '123', eventid: 'abc' }));
  // console.log('##########', await fetchJoinedEvents({ userid: 'SMT4LOlgENfm0lLit3B3vaD3Jih1' }));
  console.log('##########', await fetchExternalEventa());
}

main();
