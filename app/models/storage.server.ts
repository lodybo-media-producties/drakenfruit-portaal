import { S3 } from '@aws-sdk/client-s3';
import { type Progress, Upload } from '@aws-sdk/lib-storage';
import {
  type UploadHandler,
  UploadHandlerPart,
} from '@remix-run/server-runtime';
import { PassThrough } from 'stream';
import { writeAsyncIterableToWritable } from '@remix-run/node';

const client = new S3({
  forcePathStyle: false,
  endpoint: 'https://ams3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export function uploadTool(
  filename: string,
  callback: (progress: Progress) => void
) {
  const pass = new PassThrough();

  const upload = new Upload({
    client,
    params: {
      Bucket: 'drakenfruit-storage',
      Key: `tools/${filename}`,
      Body: pass,
    },
  });

  upload.on('httpUploadProgress', callback);

  return {
    writeStream: pass,
    promise: upload.done(),
  };
}

type ToolUploadHandlerPart = UploadHandlerPart & {
  callback: (progress: Progress) => void;
};

export type ToolUploadHandler = (
  part: ToolUploadHandlerPart
) => Promise<File | string | null | undefined>;

export const toolUploadHandler: ToolUploadHandler = async ({
  name,
  filename,
  data,
  callback,
}) => {
  console.log('Uploading tool', name, filename);
  if (name === 'tool') {
    const stream = uploadTool(filename!, callback);
    await writeAsyncIterableToWritable(data, stream.writeStream);
    const file = await stream.promise;

    if ('Location' in file) {
      return file.Location;
    }
  }

  return undefined;
};
