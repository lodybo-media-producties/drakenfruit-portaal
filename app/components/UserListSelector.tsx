import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';

type Props = Omit<ListSelectorProps, 'labels'>;

export { type ListItem } from '~/components/ListSelector';

export default function UserListSelector({
  items,
  error,
  multiple,
  ...props
}: Props) {
  const { t } = useTranslation('components');

  const labels: ListSelectorLabels = {
    title: t('UserListSelector.Title'),
    addButtonLabel: t('UserListSelector.AddButtonLabel'),
    noItemsLabel: t('UserListSelector.NoItemsLabel'),
    dialogTitle: t('UserListSelector.DialogTitle'),
    dialogDescription: t('UserListSelector.DialogDescription'),
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
