import { Component } from "react";
import { motion } from "framer-motion";
import { paginate } from "../utils/paginate.js";
import Pagination from "./common/pagination";
import SearchBox from "./common/search.jsx";
import _ from "lodash";
import { NavLink } from "react-router-dom";
import { deleteRental, getRentals } from "../services/rentalService.js";
import { toast } from "react-toastify";
import RentalsTable from "./rentalsTable.jsx";

class Rentals extends Component {
  state = {
    rentals: [],
    sortColumn: { path: "dateOut", order: "desc" },
    searchQuery: "",
    currentPage: 1,
    pageSize: 4,
  };

  async populateRentals() {
    const { data: rentals } = await getRentals();
    this.setState({ rentals });
  }

  async componentDidMount() {
    await this.populateRentals();
  }

  handleDelete = async rental => {
    const originalRentals = this.state.rentals;
    try {
      const rentals = this.state.rentals.filter(r => r._id !== rental._id);
      this.setState({ rentals });
      await deleteRental(rental._id);
      toast.success("Rental deleted successfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This rental has already been deleted.");
      }
      this.setState({ rentals: originalRentals });
    }
  };

  handlePageChange = page => this.setState({ currentPage: page });
  handleSort = sortColumn => this.setState({ sortColumn });

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      rentals: allRentals,
      sortColumn,
      searchQuery,
    } = this.state;
    let filteredRentals = allRentals;

    if (searchQuery) {
      filteredRentals = filteredRentals.filter(
        rental =>
          rental.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          rental.movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    const sortedRentals = _.orderBy(
      filteredRentals,
      [sortColumn.path],
      [sortColumn.order],
    );
    const rentals = paginate(sortedRentals, currentPage, pageSize);

    return { data: rentals, totalCount: filteredRentals?.length };
  };

  handleSearch = ({ currentTarget }) => {
    this.setState({ searchQuery: currentTarget.value, currentPage: 1 });
  };

  render() {
    const { user } = this.props;
    const { totalCount, data } = this.getPagedData();
    const { pageSize, currentPage } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <i className="fa fa-ticket text-blue-600 mr-3"></i>
                Rentals
              </h1>
              <p className="text-gray-500 mt-1">Manage movie rentals</p>
            </div>
            {user && (
              <NavLink
                to="/rentals/new"
                className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all duration-200">
                <i className="fa fa-plus mr-2"></i>
                New Rental
              </NavLink>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="fa fa-ticket text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Rentals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="fa fa-check-circle text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {this.state.rentals.filter(r => !r.dateReturned).length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i className="fa fa-clock text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Returned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {this.state.rentals.filter(r => r.dateReturned).length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full md:w-80">
                  <SearchBox
                    value={this.state.searchQuery}
                    onChange={this.handleSearch}
                  />
                </div>
                <div className="text-gray-500 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {data.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {totalCount}
                  </span>{" "}
                  rentals
                </div>
              </div>

              <RentalsTable
                rentals={data}
                onDelete={this.handleDelete}
                sortColumn={this.state.sortColumn}
                onSort={this.handleSort}
              />

              {totalCount > pageSize && (
                <div className="mt-6">
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default Rentals;
