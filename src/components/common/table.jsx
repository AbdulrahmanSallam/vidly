import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";

const Table = ({ data, columns, sortColumn, onSort }) => {
  const handleSort = path => {
    if (!path || !onSort) return;
    const order =
      sortColumn?.path === path && sortColumn?.order === "asc" ? "desc" : "asc";
    onSort({ path, order });
  };

  const renderSortIcon = key => {
    if (!sortColumn || sortColumn.path !== key) return null;
    return (
      <i
        className={`fa fa-sort-${sortColumn.order === "asc" ? "up" : "down"} text-blue-500 ml-1 text-xs`}></i>
    );
  };

  const renderCell = (item, column) => {
    if (column.content) return column.content(item);
    if (column.render) return column.render(item);
    return _.get(item, column.path);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-100">
            {columns.map(column => (
              <th
                key={column.path || column.key}
                onClick={() => handleSort(column.path)}
                className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider
                  ${column.path ? "cursor-pointer hover:text-gray-700 select-none" : ""}`}>
                <div className="flex items-center">
                  {column.label}
                  {renderSortIcon(column.path)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((item, index) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {columns.map(column => (
                  <td
                    key={item._id + (column.path || column.key)}
                    className="py-3 px-4">
                    {renderCell(item, column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <i className="fa fa-inbox text-4xl mb-3"></i>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
