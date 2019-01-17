const utils = require('../../src/utils');

describe('#formattedDates', () => {
  test('日付と5を渡すと渡した日から5日分返ること', () => {
    const actual = utils.formattedDates({ target: new Date('2018-12-30'), term: 5 });
    const expected = ['20181230', '20181231', '20190101', '20190102', '20190103'];
    expect(actual).toMatchObject(expected);
  });
});

describe('#formattedYearAndMonth', () => {
  test('日付と3を渡すと渡した日から3ヶ月返ること', () => {
    const actual = utils.formattedYearAndMonth({ target: new Date('2018-12-30'), term: 3 });
    const expected = ['201812', '201901', '201902'];
    expect(actual).toMatchObject(expected);
  });
});

describe('#joinTweet', () => {
  describe('キーワードを含まない場合', () => {
    test('falseが返ること', () => {
      const text = `テストツイートです
      キーワードは含みません`;
      const actual = utils.joinTweet(text);
      expect(actual).toBe(false);
    });
  });
  describe('キーワードを含む場合', () => {
    test('trueが返ること', () => {
      const text = `テストツイートです
        参加します`;
      const actual = utils.joinTweet(text);
      expect(actual).toBe(true);
    });
  });
});

describe('#leaveTweet', () => {
  describe('キーワードを含まない場合', () => {
    test('falseが返ること', () => {
      const text = `テストツイートです
      キーワードは含みません`;
      const actual = utils.leaveTweet(text);
      expect(actual).toBe(false);
    });
  });
  describe('キーワードを含む場合', () => {
    test('trueが返ること', () => {
      const text = `テストツイートです
        キャンセルします`;
      const actual = utils.leaveTweet(text);
      expect(actual).toBe(true);
    });
  });
});

describe('#detectHashtag', () => {
  describe('キーワードを含まない場合', () => {
    test('1件も返らないこと', () => {
      const text = `テストツイートです
      キーワードは含みません`;
      const actual = utils.detectHashtag(text);
      expect(actual).toMatchObject([]);
    });
  });
  describe('キーワードを含む場合', () => {
    describe('タグの直後が半角スペースの場合', () => {
      test('1件が返ること', () => {
        const text = `テストツイート#test です
        キャンセルします`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test']);
      });
    });
    describe('タグの直後が全角スペースの場合', () => {
      test('1件が返ること', () => {
        const text = `テストツイート#test　です
        キャンセルします`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test']);
      });
    });
    describe('タグの直後が改行の場合', () => {
      test('1件が返ること', () => {
        const text = `テストツイートです
        #test
        キャンセルします`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test']);
      });
    });
    describe('タグで開始する場合', () => {
      test('1件が返ること', () => {
        const text = `#test
        テストツイート`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test']);
      });
    });
    describe('タグで終了する場合', () => {
      test('1件が返ること', () => {
        const text = `テストツイート
        テスト#test`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test']);
      });
    });
    describe('複数該当する場合', () => {
      test('すべて返ること', () => {
        const text = `テストツイート#test_1 です
        #test_2
        キャンセル#test_3　します`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test_1', 'test_2', 'test_3']);
      });
      test('すべて返ること', () => {
        const text = `テストツイート#test_1 です
        #test_2
        キャンセル#test_3　します`;
        const actual = utils.detectHashtag(text);
        expect(actual).toMatchObject(['test_1', 'test_2', 'test_3']);
      });
    });
  });
});
