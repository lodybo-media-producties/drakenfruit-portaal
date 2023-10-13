import { type Organisation } from '@prisma/client';
import { type SerializeFrom } from '@remix-run/node';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Combobox } from '~/components/ui/combobox';
import Message from '~/components/Message';

export type OrganisationSelection = Pick<
  SerializeFrom<Organisation>,
  'id' | 'name'
>;

type Props = {
  initialOrganisation?: string;
  organisations: SerializeFrom<OrganisationSelection>[];
  error?: string;
  onSelect?: (selectedOrganisation: string) => void;
};

export default function OrganisationSelector({
  initialOrganisation,
  organisations,
  onSelect,
  error,
}: Props) {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>(
    initialOrganisation ?? ''
  );
  const [open, setOpen] = useState(false);

  const { t } = useTranslation('components');

  const options = organisations.map((organisation) => ({
    value: organisation.id,
    label: organisation.name,
  }));

  options.push({
    value: '_unselectable_custom',
    label: t('OrganisationSelector.Custom Organisation Option Label'),
  });

  const handleOrganisationSelect = (selectedValues: string) => {
    if (selectedValues.includes('_unselectable_custom')) {
      setOpen(true);
      return;
    }

    setSelectedOrganisation(selectedValues);
    onSelect?.(selectedValues);
  };

  // const handleOrganisationCreate = (organisation: Organisation) => {
  //   setSelectedOrganisation(organisation.id);
  //   onSelect?.(organisation.id);
  //
  //   setOpen(false);
  // };

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <Combobox
          width="w-[500px]"
          initialValue={selectedOrganisation}
          options={options}
          placeholder={t('OrganisationSelector.Placeholder')}
          triggerLabel={t('OrganisationSelector.Trigger Label')}
          notFoundMessage={t('OrganisationSelector.Not Found Message')}
          onSelect={handleOrganisationSelect}
          error={error}
          showSelectedInTrigger
        />
        <Message variant="error" message={error} subtle />
        <input
          className="h-0"
          type="hidden"
          name="organisationIDs"
          value={selectedOrganisation}
        />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('OrganisationSelector.Custom Organisation Dialog.Title')}
            </DialogTitle>
            <DialogDescription>
              {t('OrganisationSelector.Custom Organisation Dialog.Description')}
            </DialogDescription>
          </DialogHeader>

          <div></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
