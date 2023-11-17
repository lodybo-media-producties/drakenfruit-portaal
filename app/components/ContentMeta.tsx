import { type ArticleWithAuthorAndCategories } from '~/types/Article';
import { useTranslation } from 'react-i18next';
import { type SupportedLanguages } from '~/i18n';
import { isAfter, parseISO } from 'date-fns';
import { type SerializeFrom } from '@remix-run/node';

type Props = SerializeFrom<
  Pick<
    ArticleWithAuthorAndCategories,
    'categories' | 'createdAt' | 'updatedAt'
  > & {
    author?: ArticleWithAuthorAndCategories['author'];
  }
>;

export default function ContentMeta({
  author,
  categories,
  createdAt,
  updatedAt,
}: Props) {
  const { t, i18n } = useTranslation('components');

  const lang = i18n.language as SupportedLanguages;

  const isUpdated = isAfter(parseISO(updatedAt), parseISO(createdAt));

  return (
    <div className="text-sm text-neutral-500 dark:text-neutral-400">
      {author ? (
        <>
          {t('ContentMeta.Author', {
            author: `${author.firstName} ${author.lastName}`,
          })}
          {' | '}
        </>
      ) : null}
      {createdAt}
      {isUpdated
        ? ` (${t('ContentMeta.Updated Label', {
            date: updatedAt,
          })})`
        : null}
      {categories.length ? ' | ' : ''}
      {categories.map((category) => category.name[lang]).join(', ')}
    </div>
  );
}
