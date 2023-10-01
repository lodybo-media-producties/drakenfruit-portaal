import { type ArticleFormValues } from '~/components/ArticleMutationForm';

interface BaseValidationResult {
  success: boolean;
}

interface SuccessValidationResult<D> extends BaseValidationResult {
  success: true;
  data: D;
  errors?: never;
}

interface ErrorValidationResult<E> extends BaseValidationResult {
  success: false;
  data?: never;
  errors: E;
}

export type ValidationResult<D, E> =
  | SuccessValidationResult<D>
  | ErrorValidationResult<E>;

export type LoginData = {
  emailaddress: string;
  password: string;
  redirectTo: string;
  remember: string;
};

export type LoginErrors = {
  emailaddress?: string;
  password?: string;
  userNotFound?: string;
};

export type ArticleData = ArticleFormValues;

export type ArticleErrors = Partial<
  Record<keyof ArticleFormValues, { nl?: string; en?: string }>
>;
