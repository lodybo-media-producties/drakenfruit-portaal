import ListSelector, {
  type Props as ListSelectorProps,
  type ListSelectorLabels,
  type MultiSelectProps,
  type SingleSelectProps,
  type ListItem,
} from '~/components/ListSelector';
import { useTranslation } from 'react-i18next';
import { type SerializeFrom } from '@remix-run/node';
import { type Project } from '@prisma/client';

export type ProjectSelection = Pick<SerializeFrom<Project>, 'id' | 'name'>;

type Props = Omit<ListSelectorProps, 'labels' | 'items'> & {
  projects: ProjectSelection[];
};

export default function ProjectListSelector({
  projects,
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

  const items: ListItem[] = projects.map((project) => ({
    id: project.id,
    label: project.name,
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
