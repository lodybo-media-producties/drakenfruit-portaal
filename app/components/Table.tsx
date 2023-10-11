import ActionButton from '~/components/ActionButton';
import DeleteItemDialog from '~/components/DeleteItemDialog';
import Icon from '~/components/Icon';

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
  deletionEndpoint: string;
  customDeleteMessageKey?: string;
};

export default function Table({
  tableData,
  columns,
  onEdit,
  deletionEndpoint,
  customDeleteMessageKey,
}: Props) {
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
                  {data.get(column) === 'true' ||
                  data.get(column) === 'false' ? (
                    data.get(column) === 'true' ? (
                      <Icon name="check" />
                    ) : null
                  ) : (
                    <span>{data.get(column)}</span>
                  )}
                </td>
              ))}
              <td className="border-none p-2 flex flex-row gap-2 justify-end">
                <ActionButton onClick={() => onEdit(id)} icon="pen" />

                <DeleteItemDialog
                  itemToDelete={{ id, name: data.get('Titel') ?? '' }}
                  deletionEndpoint={deletionEndpoint}
                  additionalMessageKey={customDeleteMessageKey}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
