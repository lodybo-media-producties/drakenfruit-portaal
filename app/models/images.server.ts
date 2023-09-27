import { unstable_createFileUploadHandler } from '@remix-run/node';

export const uploadHandler = unstable_createFileUploadHandler({
  directory: './media/',
  file: ({ filename }) => filename,
});
