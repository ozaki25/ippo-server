const utils = require('../../src/utils');

describe('#formattedDates', () => {
  test('5を渡すと5日分の日付が返ること', () => {
    const actual = utils.formattedDates(new Date('2018-12-30'), 5);
    const expected = ['20181230', '20181231', '20190101', '20190102', '20190103'];
    expect(actual).toMatchObject(expected);
  });
});
