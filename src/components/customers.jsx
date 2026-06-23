import { Component } from "react";
import { motion } from "framer-motion";
import { paginate } from "../utils/paginate.js";
import Pagination from "./common/pagination";
import SearchBox from "./common/search.jsx";
import _ from "lodash";
import { NavLink } from "react-router-dom";
import { deleteCustomer, getCustomers } from "../services/customerService.js";
import { toast } from "react-toastify";
import CustomersTable from "./customersTable.jsx";

class Customers extends Component {
  state = {
    customers: [],
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
    currentPage: 1,
    pageSize: 3,
  };

  async populateCustomers() {
    const { data: customers } = await getCustomers();
    this.setState({ customers });
  }

  async componentDidMount() {
    await this.populateCustomers();
  }

  handleDelete = async customer => {
    const originalCustomers = this.state.customers;
    try {
      const customers = this.state.customers.filter(
        c => c._id !== customer._id,
      );
      this.setState({ customers });
      await deleteCustomer(customer._id);
      toast.success("Customer deleted successfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This customer has already been deleted.");
      }
      this.setState({ customers: originalCustomers });
    }
  };

  handlePageChange = page => this.setState({ currentPage: page });
  handleSort = sortColumn => this.setState({ sortColumn });

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      customers: allCustomers,
      sortColumn,
      searchQuery,
    } = this.state;
    let filteredCustomers = allCustomers;

    if (searchQuery) {
      filteredCustomers = filteredCustomers.filter(
        customer =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery),
      );
    }

    const sortedCustomers = _.orderBy(
      filteredCustomers,
      [sortColumn.path],
      [sortColumn.order],
    );
    const customers = paginate(sortedCustomers, currentPage, pageSize);

    return { data: customers, totalCount: filteredCustomers?.length };
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
          className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <i className="fa fa-users text-blue-600 mr-3"></i>
                Customers
              </h1>
              <p className="text-gray-500 mt-1">Manage your customer base</p>
            </div>
            {user && (
              <NavLink
                to="/customers/new"
                className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all duration-200">
                <i className="fa fa-plus mr-2"></i>
                New Customer
              </NavLink>
            )}
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
                  customers
                </div>
              </div>

              <CustomersTable
                customers={data}
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

export default Customers;
