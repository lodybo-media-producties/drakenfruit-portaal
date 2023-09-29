import { type User } from '~/models/user.server';
import { Combobox, type ComboboxOption } from '~/components/ui/combobox';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { useState } from 'react';
import Message from '~/components/Message';

export type Author = Pick<User, 'id' | 'firstName' | 'lastName'>;

type Props = {
  authors: Author[];
  initialSelectedAuthorID?: string;
  onSelect?: (authorID: string) => void;
  error?: string;
};

export default function AuthorSelector({
  authors,
  onSelect,
  initialSelectedAuthorID,
  error,
}: Props) {
  const [selectedAuthorID, setSelectedAuthorID] = useState(
    initialSelectedAuthorID
  );
  const { t } = useTranslation('components');

  const options: ComboboxOption[] = authors.map((author) => ({
    value: author.id,
    label: `${author.firstName} ${author.lastName}`,
  }));

  const handleAuthorSelect = (selectedAuthor: string) => {
    setSelectedAuthorID(selectedAuthor);
    if (onSelect) {
      onSelect(selectedAuthor);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        initialValue={selectedAuthorID}
        options={options}
        placeholder={t('AuthorSelector.Placeholder')}
        triggerLabel={t('AuthorSelector.Trigger Label')}
        notFoundMessage={t('AuthorSelector.Not Found Message')}
        onSelect={handleAuthorSelect}
        error={error}
        showSelectedInTrigger
      />
      <Message variant="error" message={error} subtle />
      <input
        className="h-0"
        type="hidden"
        name="authorID"
        value={selectedAuthorID}
      />
    </div>
  );
}
