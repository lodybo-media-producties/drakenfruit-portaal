import { type User } from '~/models/user.server';
import { Combobox, type ComboboxOption } from '~/components/ui/combobox';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

export type Author = Pick<User, 'id' | 'firstName' | 'lastName'>;

type Props = {
  authors: Author[];
  selectedAuthorID?: string;
  onSelect?: (authorID: string) => void;
  error?: string;
};

export default function AuthorSelector({
  authors,
  onSelect,
  selectedAuthorID,
  error,
}: Props) {
  const { t } = useTranslation('components');

  const options: ComboboxOption[] = authors.map((author) => ({
    value: author.id,
    label: `${author.firstName} ${author.lastName}`,
  }));

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        initialValue={selectedAuthorID}
        options={options}
        placeholder={t('AuthorSelector.Placeholder')}
        triggerLabel={t('AuthorSelector.Trigger Label')}
        notFoundMessage={t('AuthorSelector.Not Found Message')}
        onSelect={onSelect}
        error={error}
      />
      {error ? <div className="pt-1 text-dark-pink ">{error}</div> : null}
      <input
        className="h-0"
        type="hidden"
        name="authorID"
        value={selectedAuthorID}
      />
    </div>
  );
}
