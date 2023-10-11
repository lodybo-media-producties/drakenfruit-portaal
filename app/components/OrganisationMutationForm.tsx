import { type SyntheticEvent, useEffect, useState } from 'react';
import { type OrganisationFormValues } from '~/types/Organisations';
import {
  type OrganisationData,
  type OrganisationErrors,
} from '~/types/Validations';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import { convertOrganisationFormValuesToFormData } from '~/utils/content';
import Message from '~/components/Message';
import TextInput from '~/components/TextInput';
import TextAreaInput from '~/components/TextAreaInput';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import Loader from '~/components/Loader';
import Button from '~/components/Button';

type Props = {
  mode: 'create' | 'update';
  initialValues?: OrganisationFormValues;
  errors?: OrganisationErrors;
  backLink: string;
  backLinkLabel: string;
};

export default function OrganisationMutationForm({
  mode,
  initialValues,
  errors,
  backLink,
  backLinkLabel,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<
    APIResponse<OrganisationData> | OrganisationErrors
  >();

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<OrganisationErrors | undefined>(
    errors
  );

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? ''
  );

  const generateFormDataFromOrganisationFormValues = () => {
    return convertOrganisationFormValuesToFormData({
      id: initialValues?.id,
      name,
      description,
    });
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = generateFormDataFromOrganisationFormValues();

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

      <input
        type="hidden"
        name="organisationID"
        defaultValue={initialValues?.id}
      />

      <TextInput
        name="name"
        label={t('OrganisationMutationForm.Name Label')}
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        error={formErrors?.name}
      />

      <TextAreaInput
        label={t('OrganisationMutationForm.Description Label')}
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
        error={formErrors?.description}
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
              ? t('OrganisationMutationForm.Save Button Label')
              : t('OrganisationMutationForm.Edit Button Label')}
          </Button>
        </div>
      </div>
    </form>
  );
}
