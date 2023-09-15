/**
 * An on the fly image resizer, taken from https://github.com/remix-run/examples/blob/main/image-resize/app/routes/assets/resize/%24.ts
 *
 * Since most of our images are served via a CDN, we don't have to save the resized images.
 * Instead we set cache headers for them and let the cdn cache them for us.
 *
 * sharp uses a highly performant native package called libvips.
 * it's written in C and is extremely fast.
 *
 * The implementation of the demo uses a stream based approach where the image is never stored in memory.
 * This means it's very good at handling images of any size, and is extremely performant.
 * Further improvements could be done by implementing ETags, but that is out of scope for this demo.
 */

import type { ReadStream } from 'fs';
import * as fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import type { LoaderArgs } from '@remix-run/node';
import type { FitEnum } from 'sharp';
import sharp from 'sharp';

const PUBLIC_ROOT = 'public';
const IMAGES_ROOT = 'images';
const { createReadStream, statSync } = fs;

interface ImageRequestParams {
  src: string;
  width: number | undefined;
  height: number | undefined;
  fit: keyof FitEnum;
  root: string;
}

export const loader = async ({ params, request }: LoaderArgs) => {
  // extract all the parameters from the url
  const { src, width, height, fit, root } = extractParams(params, request);

  try {
    // read the image as a stream of bytes
    const readStream = readFileAsStream(src, root);
    // read the image from the file system and stream it through the sharp pipeline
    return streamingResize(readStream, width, height, fit);
  } catch (error: unknown) {
    // if the image is not found, or we get any other errors we return different response types
    return handleError(error);
  }
};

function extractParams(
  params: LoaderArgs['params'],
  request: Request
): ImageRequestParams {
  const src = params['*'] as string;
  const searchParams = new URL(request.url).searchParams;

  const width = searchParams.has('w')
    ? Number.parseInt(searchParams.get('w') ?? '0')
    : undefined;
  const height = searchParams.has('h')
    ? Number.parseInt(searchParams.get('h') ?? '0')
    : undefined;

  const fitEnum = ['contain', 'cover', 'fill', 'inside', 'outside'];
  let fit: keyof FitEnum = sharp.fit.contain;
  if (searchParams.has('fit')) {
    const fitParam = searchParams.get('fit') ?? '';
    if (fitEnum.includes(fitParam)) {
      fit = fitParam as keyof FitEnum;
    }
  }

  let root = IMAGES_ROOT;
  if (searchParams.has('root') && searchParams.get('root') === 'public') {
    root = PUBLIC_ROOT;
  }

  return { src, width, height, fit, root };
}

function streamingResize(
  imageStream: ReadStream,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
) {
  // create the sharp transform pipeline
  // https://sharp.pixelplumbing.com/api-resize
  // you can also add watermarks, sharpen, blur, etc.
  const sharpTransforms = sharp()
    .resize({
      width,
      height,
      fit,
      position: sharp.strategy.attention, // will try to crop the image and keep the most interesting parts
    })
    // .jpeg({
    //   mozjpeg: true, // use mozjpeg defaults, = smaller images
    //   quality: 80,
    // });
    // sharp also has other image formats, just comment out .jpeg and make sure to change the Content-Type header below
    // .avif({
    //   quality: 80,
    // });
    // .png({
    //   quality: 80,
    // });
    .webp({
      quality: 80,
    });

  // create a pass through stream that will take the input image
  // stream it through the sharp pipeline and then output it to the response
  // without buffering the entire image in memory
  const passthroughStream = new PassThrough();

  imageStream.pipe(sharpTransforms).pipe(passthroughStream);

  return new Response(passthroughStream as any, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function readFileAsStream(src: string, root: string): ReadStream {
  // Local filesystem

  // check that file exists
  const srcPath = path.join(root, src);
  const fileStat = statSync(srcPath);
  if (!fileStat.isFile()) {
    throw new Error(`${srcPath} is not a file`);
  }

  // create a readable stream from the image file
  return createReadStream(path.join(root, src));

  // Other implementations that you could look into

  // Google Cloud Storage
  // we could also create a stream directly from a bucket file
  // import { Storage } from '@google-cloud/storage'
  // const storage = new Storage();
  // const bucketName = 'my-gcp-bucket'
  // const bucketPath = src // the bucket path /dogs/cute/dog-1.jpg'
  // return storage.bucket(bucketName).file(src).createReadStream()

  // AWS S3 / Digital Ocean Spaces
  // import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
  // const s3 = new S3Client({...})
  // const bucketName = 'my-s3-bucket'
  // const bucketKey = src // 'dogs/cute/dog-1.jpg'
  // const fileResult = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: bucketKey }));
  // s3 GetObjectCommand result.Body is a ReadableStream
  // return fileResult.Body
}

function handleError(error: unknown) {
  // error needs to be typed
  const errorT = error as Error & { code: string };
  // if the read stream fails, it will have the error.code ENOENT
  console.error(error);
  if (errorT.code === 'ENOENT') {
    return new Response('image not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // if there is an error processing the image, we return a 500 error
  return new Response(errorT.message, {
    status: 500,
    statusText: errorT.message,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
