import { describe, test } from 'vitest';
import * as validationChecks from '~/validations/checks';
import { checkLocalisedValue } from '~/validations/checks';

describe('Validations', () => {
  describe('Generic validations', () => {
    test('Check whether a value is defined or not', () => {
      expect(validationChecks.isDefined(undefined)).toBe(false);
      expect(validationChecks.isDefined(null)).toBe(false);
      expect(validationChecks.isDefined('')).toBe(false);

      expect(validationChecks.isDefined('a generic string')).toBe(true);
      expect(validationChecks.isDefined({})).toBe(true);
    });

    test('Check whether a value is a string or not', () => {
      expect(validationChecks.valueIsString(undefined)).toBe(false);
      expect(validationChecks.valueIsString(null)).toBe(false);
      expect(validationChecks.valueIsString({})).toBe(false);
      expect(validationChecks.valueIsString([])).toBe(false);
      expect(validationChecks.valueIsString(false)).toBe(false);
      expect(validationChecks.valueIsString(true)).toBe(false);
      expect(validationChecks.valueIsString(1239)).toBe(false);

      expect(validationChecks.valueIsString('')).toBe(true);
      expect(validationChecks.valueIsString('a generic string')).toBe(true);
    });
  });

  describe('Email validation', () => {
    test('Check whether an email is valid or not', () => {
      expect(validationChecks.emailIsValid('')).toBe(false);
      expect(validationChecks.emailIsValid('not-an-email')).toBe(false);
      expect(validationChecks.emailIsValid('n@')).toBe(false);

      expect(validationChecks.emailIsValid('lody@startrek.com')).toBe(true);
      expect(validationChecks.emailIsValid('kaylee@salsa')).toBe(false);
    });
  });

  describe('Password validation', () => {
    test('Check whether a password is valid or not', () => {
      expect(validationChecks.validatePassword('')).toBe(false);
      expect(validationChecks.validatePassword('short')).toBe(false);
      expect(validationChecks.validatePassword('1234567')).toBe(false);

      expect(validationChecks.validatePassword('12345678')).toBe(true);
      expect(validationChecks.validatePassword('1234567890')).toBe(true);
      expect(validationChecks.validatePassword('12345678901234567890')).toBe(
        true
      );
    });

    test('Check whether a new password and a confirmation password match', () => {
      expect(
        validationChecks.validatePasswordConfirmation('12345678', '12345678')
      ).toBe(true);
      expect(
        validationChecks.validatePasswordConfirmation('12345678', '123456789')
      ).toBe(false);
    });
  });

  describe('Testing localised (form data) values', () => {
    test('Check whether a localised value is valid', () => {
      expect(
        checkLocalisedValue({
          en: 'English value',
          nl: 'Nederlandse waarde',
        })
      ).toBe(undefined);
    });

    test('Check whether a localised value is invalid because the English test is missing', () => {
      expect(
        checkLocalisedValue({
          nl: 'Nederlandse waarde',
        })
      ).toStrictEqual({
        en: 'Waarde is verplicht',
      });
    });

    test('Check whether a localised value is invalid because the Dutch test is missing', () => {
      expect(
        checkLocalisedValue({
          en: 'English value',
        })
      ).toStrictEqual({
        nl: 'Waarde is verplicht',
      });
    });

    test('Check whether a localised value is invalid because both tests are missing', () => {
      expect(checkLocalisedValue({ title: {} })).toStrictEqual({
        en: 'Waarde is verplicht',
        nl: 'Waarde is verplicht',
      });
    });
  });
});
