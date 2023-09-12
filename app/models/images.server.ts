import { unstable_createFileUploadHandler } from '@remix-run/node';

export const uploadHandler = unstable_createFileUploadHandler({
  directory: './images/',
  file: ({ filename }) => filename,
});
