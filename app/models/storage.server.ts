import { S3 } from '@aws-sdk/client-s3';
import { type Progress as AWSProgress, Upload } from '@aws-sdk/lib-storage';
import { type UploadHandlerPart } from '@remix-run/server-runtime';
import { PassThrough, type Writable } from 'stream';

interface BaseUploadState {
  state: 'prepare' | 'uploading';
}

interface PrepareUploadState extends BaseUploadState {
  state: 'prepare';
  transferred?: never;
  total?: never;
  filename?: never;
}

interface UploadingUploadState extends BaseUploadState {
  state: 'uploading';
  transferred: number;
  total: number;
  filename: string;
}

export type UploadState = PrepareUploadState | UploadingUploadState;

let currentByteLength = 0;

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
  callback: (progress: UploadState) => void
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

  upload.on('httpUploadProgress', (progress: AWSProgress) => {
    callback({
      state: 'uploading',
      transferred: progress.loaded!,
      total: currentByteLength,
      filename,
    });
  });

  return {
    writeStream: pass,
    promise: upload.done(),
  };
}

type ToolUploadHandlerPart = UploadHandlerPart & {
  callback: (progress: UploadState) => void;
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
  if (name === 'tool') {
    currentByteLength = 0;

    const stream = uploadTool(filename!, callback);

    await writeAsyncIterableToWritable(data, stream.writeStream);

    const file = await stream.promise;

    if ('Location' in file) {
      return file.Location;
    }
  }

  return undefined;
};

async function writeAsyncIterableToWritable(
  iterable: AsyncIterable<Uint8Array>,
  writable: Writable
) {
  try {
    for await (let chunk of iterable) {
      currentByteLength += chunk.byteLength;
      writable.write(chunk);
    }
    writable.end();
  } catch (error: any) {
    writable.destroy(error);
    throw error;
  }
}
