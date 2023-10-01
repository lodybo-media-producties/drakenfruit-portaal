import { type SupportedLanguages } from '~/i18n';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function isDefined(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

export function valueIsString(value: unknown): value is string {
  return typeof value === 'string';
}

export function emailIsValid(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function checkLocalisedValue(localisedValue: any) {
  let errors: { [key in SupportedLanguages]?: string } = {};

  const languages = ['en', 'nl'];

  languages.forEach((lang) => {
    if (!localisedValue[lang]) {
      if (!errors[lang as SupportedLanguages]) {
        errors[lang as SupportedLanguages] = '';
      }

      errors[lang as SupportedLanguages] = 'Waarde is verplicht';
    }
  });

  if (Object.keys(errors).length === 0) {
    return;
  }

  return errors;
}
