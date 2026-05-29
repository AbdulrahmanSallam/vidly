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

  const renderSortIcon = column => {
    if (column.path !== sortColumn.path) return null;

    if (sortColumn.order === "asc") {
      return <i className="fas fa-sort-asc"></i>;
    }
    return <i className="fas fa-sort-desc"></i>;
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
            {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
