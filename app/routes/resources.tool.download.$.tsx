import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import { downloadFile } from '~/models/storage.server';
import { PassThrough } from 'stream';
import toArray from 'stream-to-array';
import { getErrorMessage } from '~/utils/utils';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('PROJECTLEADER', request);

  const filename = params['*'];
  invariant(filename, 'filename is required');

  try {
    const fileStream = await downloadFile(filename);
    const passThroughStream = new PassThrough();
    fileStream.pipe(passThroughStream);

    const buffer = await toArray(passThroughStream).then((parts) => {
      return Buffer.concat(parts);
    });

    const blob = new Blob([buffer]);

    const suggestedFilename = filename.split('/').pop();
    return new Response(blob, {
      headers: {
        'Content-Disposition': `attachment; filename=${suggestedFilename}`,
        // 'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    console.log(error);
    const message = getErrorMessage(error);
    return json({ error: message }, { status: 500 });
  }
}
