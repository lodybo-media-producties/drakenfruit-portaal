import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
  type ListItem,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';
import { type SerializeFrom } from '@remix-run/node';
import { type Organisation } from '@prisma/client';

export type OrganisationSelection = Pick<
  SerializeFrom<Organisation>,
  'id' | 'name'
>;

type Props = Omit<ListSelectorProps, 'labels' | 'items'> & {
  organisations: OrganisationSelection[];
};

export default function OrganisationListSelector({
  organisations,
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

  const items: ListItem[] = organisations.map((organisation) => ({
    id: organisation.id,
    label: organisation.name,
  }));

  if (multiple) {
    const { selectedIds, onSelect } = props as MultiSelectProps;
    return (
      <ListSelector
        labels={labels}
        items={items}
        error={error}
        multiple
        selectedIds={selectedIds}
        onSelect={onSelect}
      />
    );
  }

  const { selectedId, onSelect } = props as SingleSelectProps;
  return (
    <ListSelector
      labels={labels}
      items={items}
      error={error}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
