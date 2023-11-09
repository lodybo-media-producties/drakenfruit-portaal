import { type ToolWithCategories } from '~/models/tools.server';
import { useTranslation } from 'react-i18next';
import { Image } from '~/components/Image';
import Button from '~/components/Button';
import Prose from './Prose';
import { type ReactNode } from 'react';

type Props = {
  tool: ToolWithCategories;
  backLink?: ReactNode;
};

export default function ToolDetails({ tool, backLink }: Props) {
  const { t, i18n } = useTranslation('components');

  const getTranslatedValue = (key: PrismaJson.Translated): string => {
    if (i18n.language === 'nl') {
      return key.nl;
    }

    return key.en;
  };

  return (
    <div className="p-8 grid [grid-template-areas:_'header_header'_'image_summary'_'description_description'] grid-cols-[1fr_30rem] grid-rows-[6rem_1fr_1fr] gap-4">
      <div className="[grid-area:_header] flex flex-row gap-2">
        {backLink ? (
          <div className="flex justify-start items-center">{backLink}</div>
        ) : null}
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold capitalize">
            {t('ToolDetails.Title')}
          </h1>
          <h2 className="text-6xl font-type">
            {getTranslatedValue(tool.name)}
          </h2>
        </div>
      </div>
      <div className="[grid-area:_image]">
        <Image
          className="w-full object-contain"
          src={tool.image}
          alt={getTranslatedValue(tool.summary)}
        />
      </div>
      <div className="[grid-area:_summary] flex flex-col gap-4">
        <h3 className="font-bold text-2xl">{t('ToolDetails.Summary title')}</h3>
        <p className="font-type text-2xl">{getTranslatedValue(tool.summary)}</p>
        <Button
          primary
          to={`/resources/tool/download/${tool.filename}`}
          download
          reloadDocument
        >
          {t('ToolDetails.Download button caption')}
        </Button>
      </div>
      <div className="[grid-area:_description] text-xl">
        <Prose>
          <div
            dangerouslySetInnerHTML={{
              __html: getTranslatedValue(tool.description),
            }}
          />
        </Prose>
      </div>
    </div>
  );
}
