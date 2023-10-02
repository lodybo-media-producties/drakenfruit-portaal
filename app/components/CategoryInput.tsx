import { type SerializeFrom } from '@remix-run/server-runtime';
import { type Category } from '~/models/categories.server';
import { Combobox } from '~/components/ui/combobox';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Message from '~/components/Message';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import CategoryMutationForm from '~/components/CategoryMutationForm';

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
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategories ?? []
  );
  const [open, setOpen] = useState(false);

  const { t, i18n } = useTranslation('components');
  const i = i18n.language === 'nl' ? 'nl' : 'en';

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name[i],
  }));
  options.push({
    value: '_unselectable_custom',
    label: t('CategoryInput.Custom Category Option Label'),
  });

  const handleCategorySelect = (selectedValues: string[]) => {
    if (selectedValues.includes('_unselectable_custom')) {
      setOpen(true);
      return;
    }

    setSelectedCategories(selectedValues);
    onSelect?.(selectedValues);
  };

  const selectedCategoriesList = categories
    .filter((category) => selectedCategories?.includes(category.id))
    .map((category) => category.name[i])
    .join(', ');

  const handleCategoryCreate = (category: Category) => {
    const newSelectedCategories = [...selectedCategories, category.id];
    setSelectedCategories(newSelectedCategories);
    onSelect?.(newSelectedCategories);

    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
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

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('CategoryInput.Custom Category Dialog.Title')}
            </DialogTitle>
            <DialogDescription>
              {t('CategoryInput.Custom Category Dialog.Description')}
            </DialogDescription>
          </DialogHeader>

          <div>
            <CategoryMutationForm
              mode="create"
              onCreatedOrEdited={handleCategoryCreate}
              noSubmit
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
