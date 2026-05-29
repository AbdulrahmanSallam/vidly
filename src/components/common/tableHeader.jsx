const TableHeader = ({ columns, sortColumn, onSort }) => {
  const raiseSort = path => {
    const sortColumnClone = { ...sortColumn };

    if (path === sortColumnClone.path) {
      sortColumnClone.order = sortColumnClone.order === "asc" ? "desc" : "asc";
    } else {
      sortColumnClone.path = path;
      sortColumnClone.order = "asc";
    }

    onSort(sortColumnClone);
  };

  return (
    <thead>
      <tr>
        {columns.map(column => (
          <th
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
            role="button">
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
