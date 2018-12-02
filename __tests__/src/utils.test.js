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
