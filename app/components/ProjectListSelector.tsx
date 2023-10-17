import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';

type Props = Omit<ListSelectorProps, 'labels'>;

export { type ListItem } from '~/components/ListSelector';

export default function ProjectListSelector({
  items,
  error,
  multiple,
  ...props
}: Props) {
  const { t } = useTranslation('components');

  const labels: ListSelectorLabels = {
    title: t('ProjectListSelector.Title'),
    addButtonLabel: t('ProjectListSelector.AddButtonLabel'),
    noItemsLabel: t('ProjectListSelector.NoItemsLabel'),
    dialogTitle: t('ProjectListSelector.DialogTitle'),
    dialogDescription: t('ProjectListSelector.DialogDescription'),
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
