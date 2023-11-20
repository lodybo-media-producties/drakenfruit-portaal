import Icon from '~/components/Icon';
import AnchorLink from '~/components/AnchorLink';

export default function Footer() {
  return (
    <div className="bg-light-blue flex flex-row justify-between items-center gap-2.5 pl-5 pr-12 py-2.5 h-16 mt-16">
      <div className="flex flex-row gap-1.5 text-sm">
        <Icon name="copyright" prefix="far" />
        <span>{`${new Date().getFullYear()} | Drakenfruit`}</span>
      </div>
      <div>
        <AnchorLink className="text-sm" to="https://www.drakenfruit.com">
          Drakenfruit.com
        </AnchorLink>
      </div>
    </div>
  );
}
