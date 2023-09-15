import { Input, inputClasses } from '~/components/ui/input';
import Icon from '~/components/Icon';

type Props = {
  /**
   * The search query
   */
  searchQuery: string;

  /**
   * The search handler
   */
  onSearch: (query: string) => void;
};

export default function SearchInput({ searchQuery = '', onSearch }: Props) {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const focusAndFocusVisible = `
  focus-within:outline-none
  focus-within:ring-2
  focus-within:ring-offset-2
  focus-within:ring-gray-400
  dark:focus-within:ring-gray-800
  ring-offset-white
  dark:ring-offset-gray-950
`;

  return (
    <div
      className={`flex flex-row px-2 ${focusAndFocusVisible} ${inputClasses.borderAndBg}`}
    >
      <label className="flex flex-row gap-2.5 place-items-center w-full">
        <Icon className="text-dark-pink" name="search" faClasses="fa-lg" />
        <Input
          className="border-none bg-transparent px-1 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
          type="search"
          placeholder="Zoek naar een artikel.."
          defaultValue={searchQuery}
          onChange={handleSearch}
        />
      </label>
    </div>
  );
}
