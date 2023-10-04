import { convertDateToUTC, validateEmail } from 'app/utils/utils';

test.skip('validateEmail returns false for non-emails', () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail('')).toBe(false);
  expect(validateEmail('not-an-email')).toBe(false);
  expect(validateEmail('n@')).toBe(false);
});

test.skip('validateEmail returns true for emails', () => {
  expect(validateEmail('kody@example.com')).toBe(true);
});

test.skip('Converting a Date to UTC', () => {
  expect(convertDateToUTC(new Date('2021-01-01T00:00:00'))).toEqual(
    new Date('2021-01-01T00:00:00Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T12:00:00'))).toEqual(
    new Date('2021-01-01T12:00:00Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59'))).toEqual(
    new Date('2021-01-01T23:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59+00:00'))).toEqual(
    new Date('2021-01-01T23:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59-00:00'))).toEqual(
    new Date('2021-01-01T23:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59+01:00'))).toEqual(
    new Date('2021-01-01T22:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59-01:00'))).toEqual(
    new Date('2021-01-02T00:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59+02:00'))).toEqual(
    new Date('2021-01-01T21:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59-02:00'))).toEqual(
    new Date('2021-01-02T01:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59+03:00'))).toEqual(
    new Date('2021-01-01T20:59:59Z')
  );
  expect(convertDateToUTC(new Date('2021-01-01T23:59:59-03:00'))).toEqual(
    new Date('2021-01-02T02:59:59Z')
  );
});

test.skip('formatDate', () => {});
