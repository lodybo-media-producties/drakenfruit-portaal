import Icon from '~/components/Icon';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';

type Props = {
  bookmarked: boolean;
  bookmarkID: string;
};

export default function BookmarkIndicator({ bookmarked, bookmarkID }: Props) {
  const bookmarkFetcher = useFetcher<APIResponse>();
  const { t } = useTranslation('components');

  const handleBookmarkToggle = () => {
    const data = new FormData();
    data.append('bookmarkId', bookmarkID);

    bookmarkFetcher.submit(data, {
      action: '/api/bookmarks',
      method: 'PUT',
    });
  };

  const isBookmarked =
    bookmarkFetcher.formData && bookmarkFetcher.formData.get('ok') === 'true'
      ? !bookmarked
      : bookmarked;

  return (
    <button
      className="flex flex-row gap-2 text-sm text-neutral-500"
      onClick={handleBookmarkToggle}
    >
      <Icon name="bookmark" prefix={isBookmarked ? 'fas' : 'far'} />
      <span>
        {isBookmarked
          ? t('BookmarkIndicator.Bookmarked')
          : t('BookmarkIndicator.Save')}
      </span>
    </button>
  );
}
