import type {
  LoginData,
  LoginErrors,
  ValidationResult,
} from '~/types/Validations';
import * as checks from './checks';
import { safeRedirect } from '~/utils/utils';

export async function validateLogin(
  request: Request
): Promise<ValidationResult<LoginData, LoginErrors>> {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const errors: LoginErrors = {};

  if (!checks.valueIsString(email)) {
    errors.emailaddress = 'E-mailadres is ongeldig';
  } else {
    if (!checks.isDefined(email)) {
      errors.emailaddress = 'Vul een e-mailadres in om in te loggen';
    }

    if (!checks.emailIsValid(email)) {
      errors.emailaddress = 'Vul een geldig e-mailadres in';
    }
  }

  if (!checks.valueIsString(password)) {
    errors.password = 'Wachtwoord is ongeldig';
  } else {
    if (!checks.isDefined(password)) {
      errors.password = 'Vul een wachtwoord in';
    }

    if (!checks.validatePassword(password)) {
      errors.password = 'Wachtwoord moet minimaal 8 tekens lang zijn';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const remember = formData.get('remember') as string;

  return {
    success: true,
    data: {
      emailaddress: email as string,
      password: password as string,
      redirectTo,
      remember,
    },
  };
}
