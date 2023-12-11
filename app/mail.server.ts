import sgMail from '@sendgrid/mail';
import { type User } from '~/models/user.server';
import { type EmailData } from '@sendgrid/helpers/classes/email-address';
import i18next from '~/i18next.server';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const from: EmailData = {
  name: 'Drakenfruit',
  email: 'contact@drakenfruit.com',
};

type WelcomeMailData = {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  tempPassword: string;
};

type WelcomeMailPayload = {
  subject: string;
  salutation: string;
  introduction: string;
  'password-instruction': string;
  'password-temp': string;
  'password-change-instruction': string;
  greeting: string;
  'company-name': string;
};

export async function sendWelcomeMailForNewUser({
  user,
  tempPassword,
}: WelcomeMailData) {
  const t = await i18next.getFixedT(user.locale, 'emails');

  const payload: WelcomeMailPayload = {
    subject: t('WelcomeUser.Subject'),
    salutation: t('WelcomeUser.Salutation', { firstname: user.firstName }),
    introduction: t('WelcomeUser.Introduction'),
    'password-instruction': t('WelcomeUser.Password Instruction'),
    'password-temp': tempPassword,
    'password-change-instruction': t('WelcomeUser.Password Change Instruction'),
    greeting: t('WelcomeUser.Greeting'),
    'company-name': t('WelcomeUser.Company Name'),
  };

  return sgMail.send({
    from,
    to: user.email,
    dynamicTemplateData: payload,
    templateId: 'd-290938c3405c4ac4a871507ce77945f9',
  });
}
