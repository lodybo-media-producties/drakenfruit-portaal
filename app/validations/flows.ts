import type {
  ArticleData,
  ArticleErrors,
  CategoryData,
  CategoryErrors,
  LoginData,
  LoginErrors,
  OrganisationData,
  OrganisationErrors,
  ProjectData,
  ProjectErrors,
  ToolData,
  ToolErrors,
  UserData,
  UserErrors,
  ValidationResult,
} from '~/types/Validations';
import * as checks from './checks';
import { safeRedirect } from '~/utils/utils';
import { isDefined } from './checks';
import { Role } from '~/models/user.server';

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
  const filename = tool.name;
  const imageData = formData.get('image') as File;
  const image = imageData.name;

  const errors: ToolErrors = {};

  errors.name = checks.checkLocalisedValue(name);
  errors.slug = checks.checkLocalisedValue(slug);
  errors.description = checks.checkLocalisedValue(description);
  errors.summary = checks.checkLocalisedValue(summary);
  if (!isDefined(filename)) {
    errors.filename = 'Bestand is verplicht';
  }
  if (!isDefined(image)) {
    errors.image = 'Afbeelding is verplicht';
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
      filename,
      image,
      categories,
    },
  };
}

export async function validateOrganisation(
  request: Request
): Promise<ValidationResult<OrganisationData, OrganisationErrors>> {
  const formData = await request.formData();
  const id = formData.get('id') as string | undefined;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const errors: OrganisationErrors = {};

  if (!isDefined(name)) {
    errors.name = 'Naam is verplicht';
  }

  if (!isDefined(description)) {
    errors.description = 'Beschrijving is verplicht';
  }

  if (
    Object.keys(errors).some((key) => errors[key as keyof OrganisationErrors])
  ) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      id,
      name,
      description,
    },
  };
}

export async function validateProject(
  request: Request
): Promise<ValidationResult<ProjectData, ProjectErrors>> {
  const formData = await request.formData();
  const id = formData.get('id') as string | undefined;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const organisationId = formData.get('organisationId') as string;

  const errors: ProjectErrors = {};

  if (!isDefined(name)) {
    errors.name = 'Naam is verplicht';
  }

  if (!isDefined(description)) {
    errors.description = 'Beschrijving is verplicht';
  }

  if (!isDefined(organisationId)) {
    errors.organisationId = 'Organisatie is verplicht';
  }

  if (Object.keys(errors).some((key) => errors[key as keyof ProjectErrors])) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      id,
      name,
      description,
      organisationId,
    },
  };
}

export async function validateUser(
  request: Request
): Promise<ValidationResult<UserData, UserErrors>> {
  const formData = await request.formData();

  const id = formData.get('id') as string | undefined;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const organisationId = formData.get('organisationId') as string;
  const avatarUrl = formData.get('avatarUrl') as string | null;
  const locale = formData.get('locale') as string;

  const errors: UserErrors = {};

  if (!isDefined(firstName)) {
    errors.firstName = 'Voornaam is verplicht';
  }

  if (!isDefined(lastName)) {
    errors.lastName = 'Achternaam is verplicht';
  }

  if (!isDefined(email)) {
    errors.email = 'E-mailadres is verplicht';
  }

  if (!isDefined(role)) {
    errors.role = 'Rol is verplicht';
  }

  if (Role[role as keyof typeof Role] === undefined) {
    errors.role = 'Rol is ongeldig';
  }

  if (!isDefined(locale)) {
    errors.locale = 'Taal is verplicht';
  }

  if (!isDefined(organisationId)) {
    errors.organisationId = 'Organisatie is verplicht';
  }

  if (Object.keys(errors).some((key) => errors[key as keyof UserErrors])) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      id,
      firstName,
      lastName,
      email,
      role: role as Role,
      locale,
      avatarUrl,
      organisationId,
      projectIds: (formData.get('projectIds') as string)
        .split(',')
        .filter(Boolean),
    },
  };
}
