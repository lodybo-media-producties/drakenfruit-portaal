import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { type Progress as AWSProgress, Upload } from '@aws-sdk/lib-storage';
import { type UploadHandlerPart } from '@remix-run/server-runtime';
import { PassThrough, type Writable } from 'stream';
import { type ReadStream } from 'node:fs';

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

export type StorageType = 'article' | 'tool' | 'webinar' | 'image';

let currentByteLength = 0;

export const client = new S3({
  forcePathStyle: false,
  endpoint: 'https://ams3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export function uploadToDO(
  filename: string,
  type: StorageType,
  callback: (progress: UploadState) => void
) {
  const pass = new PassThrough();

  const upload = new Upload({
    client,
    params: {
      Bucket: 'drakenfruit-storage',
      Key: `portal/${type}/${filename}`,
      Body: pass,
      // ACL: 'public-read', // Turned off for privacy. Use signed urls instead if needed.
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

export async function retrieveFromDO(src: string) {
  const data = await client.send(
    new GetObjectCommand({
      Bucket: 'drakenfruit-storage',
      Key: src,
    })
  );

  // Casting to ReadStream is safe because we know the data is a stream.
  // The type is a union of Browser and NodeJS streams but, we only work with NodeJs here.
  return data.Body as unknown as ReadStream;
}

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

type StorageUploadHandlerPart = UploadHandlerPart & {
  callback: (progress: UploadState) => void;
  runHandler?: boolean;
};

export type StorageUploadHandler = (
  part: StorageUploadHandlerPart
) => Promise<File | string | null | undefined>;

export const toolUploadHandler: StorageUploadHandler = async ({
  name,
  filename,
  data,
  callback,
  runHandler = true,
}) => {
  if (runHandler) {
    if (name === 'tool' || name === 'image') {
      currentByteLength = 0;

      const stream = uploadToDO(filename!, 'tool', callback);

      await writeAsyncIterableToWritable(data, stream.writeStream);

      const file = await stream.promise;

      if ('Key' in file) {
        return file.Key;
      }
    }
  }

  return undefined;
};

export const articleUploadHandler: StorageUploadHandler = async ({
  name,
  filename,
  data,
  callback,
}) => {
  if (name === 'image') {
    currentByteLength = 0;

    const stream = uploadToDO(filename!, 'article', callback);

    await writeAsyncIterableToWritable(data, stream.writeStream);

    const file = await stream.promise;

    if ('Key' in file) {
      return file.Key;
    }
  }

  return undefined;
};

export const avatarUploadHandler: StorageUploadHandler = async ({
  name,
  filename,
  data,
  callback,
  runHandler = true,
}) => {
  if (runHandler) {
    if (name === 'avatar') {
      currentByteLength = 0;

      const stream = uploadToDO(filename!, 'image', callback);

      await writeAsyncIterableToWritable(data, stream.writeStream);

      const file = await stream.promise;

      if ('Key' in file) {
        return file.Key;
      }
    }
  }

  return undefined;
};
