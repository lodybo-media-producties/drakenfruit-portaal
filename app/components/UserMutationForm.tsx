import { type SyntheticEvent, useEffect, useState } from 'react';
import { type UserData, type UserErrors } from '~/types/Validations';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import { convertUserFormValuesToFormData } from '~/utils/content';
import Message from '~/components/Message';
import TextInput from '~/components/TextInput';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import Loader from '~/components/Loader';
import Button from '~/components/Button';
import OrganisationListSelector, {
  type OrganisationSelection,
} from '~/components/OrganisationListSelector';
import { type UserFormValues } from '~/types/User';
import ProjectListSelector, {
  type ProjectSelection,
} from '~/components/ProjectListSelector';
import SelectInput, { type SelectOption } from '~/components/Select';

type Props = {
  mode: 'create' | 'update';
  initialValues?: UserFormValues;
  organisations: OrganisationSelection[];
  projects: ProjectSelection[];
  backLink: string;
  backLinkLabel: string;
};

export default function UserMutationForm({
  mode,
  initialValues,
  organisations,
  projects,
  backLink,
  backLinkLabel,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<APIResponse<UserData> | UserErrors>();

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<UserErrors | undefined>(
    undefined
  );

  const [firstName, setFirstName] = useState(initialValues?.firstName ?? '');
  const [lastName, setLastName] = useState(initialValues?.lastName ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [role, setRole] = useState(initialValues?.role ?? '');
  const [locale, setLocale] = useState(initialValues?.locale ?? 'nl');
  const [avatarUrl, setAvatarUrl] = useState(initialValues?.avatarUrl ?? '');
  const [organisationId, setOrganisationId] = useState(
    initialValues?.organisationId ?? ''
  );
  const [projectIds, setProjectIds] = useState(
    initialValues?.projectIds ?? ['']
  );

  const roleOptions: SelectOption[] = [
    { value: 'MAINTAINER', label: t('UserMutationForm.Roles.MAINTAINER') },
    { value: 'ADMIN', label: t('UserMutationForm.Roles.ADMIN') },
    {
      value: 'OFFICEMANAGER',
      label: t('UserMutationForm.Roles.OFFICEMANAGER'),
    },
    { value: 'CONSULTANT', label: t('UserMutationForm.Roles.CONSULTANT') },
    {
      value: 'PROJECTLEADER',
      label: t('UserMutationForm.Roles.PROJECTLEADER'),
    },
  ];

  const localeOptions: SelectOption[] = [
    { value: 'nl', label: t('UserMutationForm.Locales.Dutch') },
    { value: 'en', label: t('UserMutationForm.Locales.English') },
  ];

  const generateFormDataFromUserFormValues = () => {
    return convertUserFormValuesToFormData({
      id: initialValues?.id,
      firstName,
      lastName,
      email,
      role,
      locale,
      avatarUrl,
      organisationId,
      projectIds,
    });
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = generateFormDataFromUserFormValues();

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

      <div className="flex flex-row items-center gap-2">
        <TextInput
          label={t('UserMutationForm.First Name Label')}
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          error={formErrors?.firstName}
        />

        <TextInput
          label={t('UserMutationForm.Last Name Label')}
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          error={formErrors?.lastName}
        />
      </div>

      <TextInput
        label={t('UserMutationForm.Email Label')}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        error={formErrors?.email}
      />

      <TextInput
        label={t('UserMutationForm.Avatar URL Label')}
        value={avatarUrl}
        onChange={(event) => {
          setAvatarUrl(event.target.value);
        }}
        error={formErrors?.avatarUrl}
      />

      <SelectInput
        placeholder={t('UserMutationForm.Role Label')}
        initialValue={role}
        options={roleOptions}
        onValueChange={setRole}
        error={formErrors?.role}
      />

      <SelectInput
        placeholder={t('UserMutationForm.Locale Label')}
        initialValue={locale}
        options={localeOptions}
        onValueChange={setLocale}
        error={formErrors?.locale}
      />

      <ProjectListSelector
        projects={projects}
        selectedIds={projectIds}
        onSelect={setProjectIds}
        multiple
        error={formErrors?.projectIds}
      />

      <OrganisationListSelector
        organisations={organisations}
        selectedId={organisationId}
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
              ? t('UserMutationForm.Save Button Label')
              : t('UserMutationForm.Edit Button Label')}
          </Button>
        </div>
      </div>
    </form>
  );
}
