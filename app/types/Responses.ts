interface BaseAPIResponse {
  ok: boolean;
}

interface SuccessResponse extends BaseAPIResponse {
  ok: true;
}

interface ErrorResponse extends BaseAPIResponse {
  ok: false;
  message: string;
}

export type APIResponse = SuccessResponse | ErrorResponse;

export type ErrorFields = Record<string, string>;
interface FormErrorResponse extends BaseAPIResponse {
  fields: ErrorFields;
}

export type FormResponse = SuccessResponse | FormErrorResponse;

export type ImageUploadResponse = {
  location: string;
};
