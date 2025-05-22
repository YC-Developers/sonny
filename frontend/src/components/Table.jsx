const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-700">
                {columns.map((column) => (
                  <td
                    key={`${row.id || rowIndex}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
