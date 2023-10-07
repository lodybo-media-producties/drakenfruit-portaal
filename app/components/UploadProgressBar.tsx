import { Progress } from '~/components/ui/progress';

type Props = {
  progress: number;
  subLabels?: string[];
};

export default function UploadProgressBar({ progress, subLabels }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Progress value={progress} />
      {subLabels && subLabels.length ? (
        <div className="flex flex-row gap-2 justify-between">
          {subLabels.map((label) => (
            <small className="text-dark-pink" key={label}>
              {label}
            </small>
          ))}
        </div>
      ) : null}
    </div>
  );
}
