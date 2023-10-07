import type {
  ArticleData,
  ArticleErrors,
  CategoryData,
  CategoryErrors,
  LoginData,
  LoginErrors,
  ToolData,
  ToolErrors,
  ValidationResult,
} from '~/types/Validations';
import * as checks from './checks';
import { safeRedirect } from '~/utils/utils';
import { isDefined } from './checks';

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

// TODO: for the content pieces, can't we just use convertFormDataToContentFormValues()?
export async function validateArticle(
  request: Request
): Promise<ValidationResult<ArticleData, ArticleErrors>> {
  const formData = await request.formData();

  const title = {
    en: formData.get('title.en') as string,
    nl: formData.get('title.nl') as string,
  };
  const slug = {
    en: formData.get('slug.en') as string,
    nl: formData.get('slug.nl') as string,
  };
  const summary = {
    en: formData.get('summary.en') as string,
    nl: formData.get('summary.nl') as string,
  };
  const content = {
    en: formData.get('content.en') as string,
    nl: formData.get('content.nl') as string,
  };
  const authorId = formData.get('authorId');
  const image = formData.get('image') as string;

  const errors: ArticleErrors = {};

  errors.title = checks.checkLocalisedValue(title);
  errors.slug = checks.checkLocalisedValue(slug);
  errors.summary = checks.checkLocalisedValue(summary);
  errors.content = checks.checkLocalisedValue(content);

  if (!isDefined(authorId)) {
    errors.authorId = {
      en: 'Author is required',
      nl: 'Auteur is verplicht',
    };
  }

  if (!isDefined(image)) {
    errors.image = {
      en: 'Image is required',
      nl: 'Afbeelding is verplicht',
    };
  }

  if (Object.keys(errors).some((key) => errors[key as keyof ArticleErrors])) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      slug,
      summary,
      content,
      categories: (formData.get('categories') as string)
        .split(',')
        .filter(Boolean),
      authorId: authorId as string,
      image,
    },
  };
}

export async function validateCategory(
  request: Request
): Promise<ValidationResult<CategoryData, CategoryErrors>> {
  const formData = await request.formData();

  const name = {
    en: formData.get('name.en') as string,
    nl: formData.get('name.nl') as string,
  };
  const slug = {
    en: formData.get('slug.en') as string,
    nl: formData.get('slug.nl') as string,
  };
  const description = {
    en: formData.get('description.en') as string,
    nl: formData.get('description.nl') as string,
  };

  const errors: CategoryErrors = {};

  errors.name = checks.checkLocalisedValue(name);
  errors.slug = checks.checkLocalisedValue(slug);
  errors.description = checks.checkLocalisedValue(description);

  if (Object.keys(errors).some((key) => errors[key as keyof CategoryErrors])) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, slug, description },
  };
}

export async function validateTool(
  request: Request
): Promise<ValidationResult<ToolData, ToolErrors>> {
  const formData = await request.formData();

  const name = {
    en: formData.get('name.en') as string,
    nl: formData.get('name.nl') as string,
  };
  const slug = {
    en: formData.get('slug.en') as string,
    nl: formData.get('slug.nl') as string,
  };
  const description = {
    en: formData.get('description.en') as string,
    nl: formData.get('description.nl') as string,
  };
  const summary = {
    en: formData.get('summary.en') as string,
    nl: formData.get('summary.nl') as string,
  };
  const categories = (formData.get('categories') as string)
    .split(',')
    .filter(Boolean);

  const tool = formData.get('tool') as File;
  const downloadUrl = tool.name;

  const errors: ToolErrors = {};

  errors.name = checks.checkLocalisedValue(name);
  errors.slug = checks.checkLocalisedValue(slug);
  errors.description = checks.checkLocalisedValue(description);
  errors.summary = checks.checkLocalisedValue(summary);
  if (!isDefined(downloadUrl)) {
    errors.downloadUrl = 'Bestand is verplicht';
  }

  if (Object.keys(errors).some((key) => errors[key as keyof ToolErrors])) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      slug,
      description,
      summary,
      downloadUrl,
      categories,
    },
  };
}
