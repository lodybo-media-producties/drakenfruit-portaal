import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';

type Props = Omit<ListSelectorProps, 'labels'>;

export { type ListItem } from '~/components/ListSelector';

export default function OrganisationListSelector({
  items,
  error,
  multiple,
  ...props
}: Props) {
  const { t } = useTranslation('components');

  const labels: ListSelectorLabels = {
    title: t('OrganisationListSelector.Title'),
    addButtonLabel: t('OrganisationListSelector.AddButtonLabel'),
    noItemsLabel: t('OrganisationListSelector.NoItemsLabel'),
    dialogTitle: t('OrganisationListSelector.DialogTitle'),
    dialogDescription: t('OrganisationListSelector.DialogDescription'),
  };

  if (multiple) {
    const { selectedIds, onChange } = props as MultiSelectProps;
    return (
      <ListSelector
        labels={labels}
        items={items}
        error={error}
        multiple
        selectedIds={selectedIds}
        onChange={onChange}
      />
    );
  }

  const { selectedId, onChange } = props as SingleSelectProps;
  return (
    <ListSelector
      labels={labels}
      items={items}
      error={error}
      selectedId={selectedId}
      onChange={onChange}
    />
  );
}
