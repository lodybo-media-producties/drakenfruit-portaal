import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import ActionButton from '~/components/ActionButton';
import { useTranslation } from 'react-i18next';
import Button from '~/components/Button';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import Icon from '~/components/Icon';
import { type APIResponse } from '~/types/Responses';
import Message from '~/components/Message';
import Loader from '~/components/Loader';

type ItemToDelete = {
  id: string;
  name?: string;
};

type Props = {
  itemToDelete: ItemToDelete;
  deletionEndpoint: string;
  additionalMessage?: string;
};

export default function DeleteItemDialog({
  itemToDelete,
  deletionEndpoint,
  additionalMessage,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<APIResponse>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.ok) {
        setOpen(false);
      } else {
        setError(fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (open) {
      setError('');
    }
  }, [open]);

  const deleteItem = () => {
    fetcher.submit(
      {
        id: itemToDelete.id,
      },
      {
        action: deletionEndpoint,
        method: 'DELETE',
      }
    );
  };

  const isSubmitting = fetcher.state !== 'idle';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionButton icon="trash-alt" destructive />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Delete Item Dialog.Title')}</DialogTitle>
          <DialogDescription className="space-y-6">
            <span className="block">{t('Delete Item Dialog.Message')}</span>
            {additionalMessage ? (
              <span
                className="block"
                dangerouslySetInnerHTML={{ __html: additionalMessage }}
              />
            ) : null}
            {itemToDelete.name ? (
              <span className="font-type text-lg block">
                <Icon name="trash-alt" className="mr-2" sizes="s" />
                {itemToDelete.name}
              </span>
            ) : null}
            {error ? <Message variant="error" message={error} /> : null}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {isSubmitting ? (
            <div className="self-center">
              <Loader />
            </div>
          ) : null}
          <Button
            disabled={isSubmitting}
            animated={false}
            onClick={() => setOpen(false)}
          >
            {t('Delete Item Dialog.Cancel Button Label')}
          </Button>
          <Button
            disabled={isSubmitting}
            animated={false}
            primary
            onClick={deleteItem}
          >
            {t('Delete Item Dialog.Delete Button Label')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
