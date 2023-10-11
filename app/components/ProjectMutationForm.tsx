import { type SyntheticEvent, useEffect, useState } from 'react';
import { type ProjectFormValues } from '~/types/Project';
import { type ProjectData, type ProjectErrors } from '~/types/Validations';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import { convertProjectFormValuesToFormData } from '~/utils/content';
import Message from '~/components/Message';
import TextInput from '~/components/TextInput';
import TextAreaInput from '~/components/TextAreaInput';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import Loader from '~/components/Loader';
import Button from '~/components/Button';
import OrganisationSelector, {
  type OrganisationSelection,
} from '~/components/OrganisationSelector';

type Props = {
  mode: 'create' | 'update';
  initialValues?: ProjectFormValues;
  organisations: OrganisationSelection[];
  backLink: string;
  backLinkLabel: string;
};

export default function ProjectMutationForm({
  mode,
  initialValues,
  organisations,
  backLink,
  backLinkLabel,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<APIResponse<ProjectData> | ProjectErrors>();

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<ProjectErrors | undefined>(
    undefined
  );

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? ''
  );
  const [organisationId, setOrganisationId] = useState(
    initialValues?.organisationId ?? ''
  );

  const generateFormDataFromProjectFormValues = () => {
    return convertProjectFormValuesToFormData({
      id: initialValues?.id,
      name,
      description,
      organisationId,
    });
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = generateFormDataFromProjectFormValues();

    fetcher.submit(formData, {
      method: mode === 'create' ? 'POST' : 'PUT',
    });
  };

  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data) {
      const { data } = fetcher;

      if ('ok' in data) {
        if (!data.ok) {
          setError(data.message);
          window.scrollTo(0, 0);
        }
      } else {
        setFormErrors(data);
      }
    }
  }, [fetcher]);

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Message variant="error" message={error} />

      <TextInput
        name="name"
        label={t('ProjectMutationForm.Name Label')}
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        error={formErrors?.name}
      />

      <TextAreaInput
        label={t('ProjectMutationForm.Description Label')}
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
        error={formErrors?.description}
      />

      <OrganisationSelector
        organisations={organisations}
        initialOrganisation={organisationId}
        onSelect={setOrganisationId}
        error={formErrors?.organisationId}
      />

      <div
        className={`flex flex-row items-center ${
          backLink && backLinkLabel ? 'justify-between' : 'justify-end'
        }`}
      >
        {backLink && backLinkLabel ? (
          <AnchorLink to={backLink}>
            <Icon className="mr-1" name="arrow-left" /> {backLinkLabel}
          </AnchorLink>
        ) : null}

        <div className="flex flex-row gap-2">
          {isSubmitting ? (
            <div className="self-center">
              <Loader />
            </div>
          ) : null}
          <Button disabled={isSubmitting} primary type="submit">
            {mode === 'create'
              ? t('ProjectMutationForm.Save Button Label')
              : t('ProjectMutationForm.Edit Button Label')}
          </Button>
        </div>
      </div>
    </form>
  );
}
