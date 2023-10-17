import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
  type ListItem,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';
import { type SerializeFrom } from '@remix-run/node';
import { type User } from '@prisma/client';

export type UserSelection = Pick<
  SerializeFrom<User>,
  'id' | 'firstName' | 'lastName'
>;

type Props = Omit<ListSelectorProps, 'labels' | 'items'> & {
  users: UserSelection[];
};

export default function UserListSelector({
  users,
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

  const items: ListItem[] = users.map((user) => ({
    id: user.id,
    label: `${user.firstName} ${user.lastName}`,
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
