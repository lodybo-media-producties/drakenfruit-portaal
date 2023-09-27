import { describe, test } from 'vitest';
import * as validationChecks from '~/validations/checks';
import * as validationFlows from '~/validations/flows';

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
  });

  describe('Login validation', () => {
    test('Check whether a login request is valid or not', async () => {
      const formData = new FormData();
      formData.append('email', 'lody@drakenfruit.com');
      formData.append('password', '123456789');

      const loginRequest = new Request('http://localhost:3000/login', {
        method: 'POST',
        body: formData,
      });

      const validationResult =
        await validationFlows.validateLogin(loginRequest);
      expect(validationResult.success).toBe(true);
    });
  });
});
