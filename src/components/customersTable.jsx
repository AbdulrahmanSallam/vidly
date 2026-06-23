import { Component } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/authService";

class CustomersTable extends Component {
  columns = [
    {
      key: "name",
      label: "Name",
      render: customer => (
        <Link
          to={`/customers/${customer._id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <i className="fa fa-user mr-2 text-gray-400"></i>
          {customer.name}
        </Link>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: customer => (
        <span className="flex items-center text-gray-700">
          <i className="fa fa-phone mr-2 text-green-500"></i>
          {customer.phone}
        </span>
      ),
    },
    {
      key: "isGold",
      label: "Status",
      render: customer =>
        customer.isGold ? (
          <span className="inline-flex items-center px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
            <i className="fa fa-star mr-1"></i>
            Gold
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            Regular
          </span>
        ),
    },
  ];

  deleteColumn = {
    key: "delete",
    render: customer => (
      <button
        onClick={() => this.props.onDelete(customer)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete customer">
        <i className="fa fa-trash"></i>
      </button>
    ),
  };

  constructor() {
    super();
    const user = authService.getCurrentUser();
    if (user && user.isAdmin) {
      this.columns.push(this.deleteColumn);
    }
  }

  handleSort = key => {
    const { sortColumn, onSort } = this.props;
    const order =
      sortColumn.path === key && sortColumn.order === "asc" ? "desc" : "asc";
    onSort({ path: key, order });
  };

  renderSortIcon = key => {
    const { sortColumn } = this.props;
    if (sortColumn.path !== key)
      return <i className="fa fa-sort text-gray-300 ml-1"></i>;
    return (
      <i
        className={`fa fa-sort-${sortColumn.order === "asc" ? "up" : "down"} text-blue-500 ml-1`}></i>
    );
  };

  render() {
    const { customers } = this.props;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              {this.columns.map(col => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.key !== "delete" && this.handleSort(col.key)
                  }
                  className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider 
                    ${col.key !== "delete" ? "cursor-pointer hover:text-gray-700" : ""}`}>
                  {col.label}
                  {col.key !== "delete" && this.renderSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {customers.map(customer => (
                <motion.tr
                  key={customer._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {this.columns.map(col => (
                    <td key={col.key} className="py-3 px-4">
                      {col.render(customer)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <i className="fa fa-users text-4xl mb-3"></i>
            <p>No customers found</p>
          </div>
        )}
      </div>
    );
  }
}

export default CustomersTable;
