import { Component } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Like from "./common/like";
import { Link } from "react-router-dom";
import authService from "../services/authService";

class MoviesTable extends Component {
  columns = [
    {
      key: "title",
      label: "Title",
      render: movie => (
        <Link
          to={`/movies/${movie._id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <i className="fa fa-film mr-2 text-gray-400"></i>
          {movie.title}
        </Link>
      ),
    },
    {
      key: "genre.name",
      label: "Genre",
      render: movie => (
        <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
          {movie.genre?.name}
        </span>
      ),
    },
    {
      key: "numberInStock",
      label: "Stock",
      render: movie => (
        <span
          className={`font-semibold ${movie.numberInStock < 5 ? "text-red-500" : "text-green-600"}`}>
          {movie.numberInStock}
        </span>
      ),
    },
    {
      key: "dailyRentalRate",
      label: "Rate",
      render: movie => (
        <span className="font-medium text-gray-700">
          ${movie.dailyRentalRate}
        </span>
      ),
    },
    {
      key: "like",
      label: "",
      render: movie => (
        <Like liked={movie.liked} onClick={() => this.props.onLike(movie)} />
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    label: "",
    render: movie => (
      <button
        onClick={() => this.props.onDelete(movie)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete movie">
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
    const { movies } = this.props;
    const sortableKeys = [
      "title",
      "genre.name",
      "numberInStock",
      "dailyRentalRate",
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
              {movies.map((movie, index) => (
                <motion.tr
                  key={movie._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {this.columns.map(col => (
                    <td key={col.key} className="py-3 px-4">
                      {col.render(movie)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {movies.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <i className="fa fa-film text-4xl mb-3"></i>
            <p>No movies found</p>
          </div>
        )}
      </div>
    );
  }
}

export default MoviesTable;
