import Icon from '~/components/Icon';
import { ReactNode } from 'react';

export type Columns = string[];
export type TableDataMap<K extends string, V> = Map<K, V>;

export type TableData = {
  id: string;
  data: TableDataMap<Columns[number], string>;
};

type Props = {
  columns: string[];
  tableData: TableData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function Table({ tableData, columns, onEdit, onDelete }: Props) {
  return (
    <div>
      <table className="table-fixed w-full border-collapse border border-light-pink">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={`column_${column}`}
                className="text-left p-2 border-none bg-light-pink"
              >
                {column}
              </th>
            ))}
            <th className="text-left p-2 border-none bg-light-pink"></th>
          </tr>
        </thead>

        <tbody>
          {tableData.map(({ id, data }) => (
            <tr key={`row_${id}`}>
              {columns.map((column) => (
                <td key={`item_${id}_${column}`} className="border-none p-2">
                  {data.get(column)}
                </td>
              ))}
              <td className="border-none p-2 flex flex-row gap-2 justify-end">
                <ActionButton
                  onClick={() => onEdit(id)}
                  backgroundColor="bg-light-blue"
                >
                  <Icon name="pen" />
                </ActionButton>

                <ActionButton
                  onClick={() => onDelete(id)}
                  backgroundColor="bg-dark-pink"
                  textColor="text-egg-white"
                >
                  <Icon name="trash-alt" />
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  children: ReactNode;
  backgroundColor: string;
  textColor?: string;
};

function ActionButton({
  onClick,
  children,
  backgroundColor,
  textColor = 'text-black',
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 ${backgroundColor} ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
    >
      {children}
    </button>
  );
}
