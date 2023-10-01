import { type SerializeFrom } from '@remix-run/server-runtime';
import { type Category } from '@prisma/client';
import { Combobox } from '~/components/ui/combobox';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Message from '~/components/Message';

export type CategorySelection = Pick<SerializeFrom<Category>, 'id' | 'name'>;

type Props = {
  initialCategories?: string[];
  categories: SerializeFrom<CategorySelection>[];
  error?: string;
  onSelect?: (selectedCategories: string[]) => void;
};

export default function CategoryInput({
  categories,
  initialCategories,
  error,
  onSelect,
}: Props) {
  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);

  const { t, i18n } = useTranslation('components');
  const i = i18n.language === 'nl' ? 'nl' : 'en';

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name[i],
  }));

  const handleCategorySelect = (selectedValues: string[]) => {
    setSelectedCategories(selectedValues);
    onSelect?.(selectedValues);
  };

  const selectedCategoriesList = categories
    .filter((category) => selectedCategories?.includes(category.id))
    .map((category) => category.name[i])
    .join(', ');

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        multiple
        initialValues={selectedCategories}
        options={options}
        placeholder={t('CategoryInput.Placeholder')}
        triggerLabel={t('CategoryInput.Trigger Label')}
        notFoundMessage={t('CategoryInput.Not Found Message')}
        onSelect={handleCategorySelect}
        error={error}
        showSelectedInTrigger={false}
      />
      {selectedCategories?.length ? (
        <div className="text-dark-blue">
          {t('CategoryInput.Selected Categories Label', {
            categories: selectedCategoriesList ?? '',
            count: selectedCategories?.length,
          })}
        </div>
      ) : null}
      <Message variant="error" message={error} subtle />
      <input
        className="h-0"
        type="hidden"
        name="categoryIDs"
        value={selectedCategories}
      />
    </div>
  );
}
