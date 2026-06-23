import { Component } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import authService from "../services/authService";

const formatDate = date => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

class RentalsTable extends Component {
  columns = [
    {
      key: "customer.name",
      label: "Customer",
      render: rental => (
        <Link
          to={`/customers/${rental.customer?._id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <i className="fa fa-user mr-2 text-gray-400"></i>
          {rental.customer?.name}
        </Link>
      ),
    },
    {
      key: "movie.title",
      label: "Movie",
      render: rental => (
        <Link
          to={`/movies/${rental.movie?._id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <i className="fa fa-film mr-2 text-gray-400"></i>
          {rental.movie?.title}
        </Link>
      ),
    },
    {
      key: "dateOut",
      label: "Rented",
      render: rental => (
        <span className="flex items-center text-gray-700">
          <i className="fa fa-calendar-plus mr-2 text-blue-500"></i>
          {formatDate(rental.dateOut)}
        </span>
      ),
    },
    {
      key: "dateReturned",
      label: "Returned",
      render: rental => (
        <span
          className={`flex items-center ${rental.dateReturned ? "text-green-600" : "text-orange-500"}`}>
          <i
            className={`fa ${rental.dateReturned ? "fa-check-circle" : "fa-clock"} mr-2`}></i>
          {rental.dateReturned ? formatDate(rental.dateReturned) : "Pending"}
        </span>
      ),
    },
    {
      key: "rentalFee",
      label: "Fee",
      render: rental => (
        <span className="font-semibold text-gray-900">
          ${rental.rentalFee || rental.movie?.dailyRentalRate || 0}
        </span>
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    label: "",
    render: rental => (
      <button
        onClick={() => this.props.onDelete(rental)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete rental">
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
      return <i className="fa fa-sort text-gray-300 ml-1 text-xs"></i>;
    return (
      <i
        className={`fa fa-sort-${sortColumn.order === "asc" ? "up" : "down"} text-blue-500 ml-1 text-xs`}></i>
    );
  };

  render() {
    const { rentals } = this.props;
    const sortableKeys = [
      "customer.name",
      "movie.title",
      "dateOut",
      "dateReturned",
      "rentalFee",
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              {this.columns.map(col => (
                <th
                  key={col.key}
                  onClick={() =>
                    sortableKeys.includes(col.key) && this.handleSort(col.key)
                  }
                  className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider
                    ${sortableKeys.includes(col.key) ? "cursor-pointer hover:text-gray-700" : ""}`}>
                  <div className="flex items-center">
                    {col.label}
                    {sortableKeys.includes(col.key) &&
                      this.renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rentals.map((rental, index) => (
                <motion.tr
                  key={rental._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors
                    ${rental.dateReturned ? "" : "bg-orange-50/30"}`}>
                  {this.columns.map(col => (
                    <td key={col.key} className="py-3 px-4">
                      {col.render(rental)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {rentals.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <i className="fa fa-ticket text-4xl mb-3"></i>
            <p>No rentals found</p>
          </div>
        )}
      </div>
    );
  }
}

export default RentalsTable;
