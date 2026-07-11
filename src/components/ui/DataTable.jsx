import clsx from "clsx";

export default function DataTable({ columns, rows, getRowKey }) {
  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={getRowKey ? getRowKey(row, i) : i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-cards" role="list">
        {rows.map((row, i) => (
          <div key={getRowKey ? getRowKey(row, i) : i} className="table-card" role="listitem">
            {columns.map((col) => (
              <div key={col.key} className="table-card-row">
                <span className="table-card-label">{col.label}</span>
                <span className="table-card-value">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
