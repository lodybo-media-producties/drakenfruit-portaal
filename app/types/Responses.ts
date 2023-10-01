interface BaseAPIResponse {
  ok: boolean;
}

interface SuccessResponse extends BaseAPIResponse {
  ok: true;
}
interface SuccessResponseWithData<T> extends BaseAPIResponse {
  ok: true;
  data?: T;
}

interface ErrorResponse extends BaseAPIResponse {
  ok: false;
  message: string;
}

export type APIResponse<T = void> =
  | SuccessResponse
  | SuccessResponseWithData<T>
  | ErrorResponse;

export type ErrorFields = Record<string, string>;
interface FormErrorResponse extends BaseAPIResponse {
  fields: ErrorFields;
}

export type FormResponse<T = void> =
  | SuccessResponse
  | SuccessResponseWithData<T>
  | FormErrorResponse;

export type ImageUploadResponse = {
  location: string;
};
