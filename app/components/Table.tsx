import ActionButton from '~/components/ActionButton';
import DeleteItemDialog from '~/components/DeleteItemDialog';

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
                <ActionButton onClick={() => onEdit(id)} icon="pen" />

                <DeleteItemDialog
                  itemToDelete={{ id, name: data.get('Titel') ?? '' }}
                  deletionEndpoint="/api/articles"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
