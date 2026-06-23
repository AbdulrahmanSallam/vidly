import Joi from "joi-browser";
import { motion, AnimatePresence } from "framer-motion";
import withRouter from "../utils/withRouter";
import Form from "./common/form";
import { getCustomer, saveCustomer } from "../services/customerService";
import { toast } from "react-toastify";

class CustomerForm extends Form {
  state = {
    data: {
      name: "",
      phone: "",
      isGold: false,
    },
    errors: {},
  };

  schema = {
    name: Joi.string().min(5).max(50).required().label("Name"),
    phone: Joi.string().min(5).max(50).required().label("Phone"),
    _id: Joi.string(),
    isGold: Joi.boolean(),
  };

  async populateCustomer() {
    try {
      const customerId = this.props.params.id;
      if (!customerId) return;

      const { data: customer } = await getCustomer(customerId);
      this.setState({
        data: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone,
          isGold: customer.isGold,
        },
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        return this.props.navigate("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateCustomer();
  }

  doSubmit = async () => {
    try {
      const customerId = this.props.params.id;
      const customerData = { ...this.state.data };

      if (customerId) {
        customerData._id = customerId;
        await saveCustomer(customerData);
        toast.success("Customer updated successfully!");
      } else {
        delete customerData._id;
        await saveCustomer(customerData);
        toast.success("Customer created successfully!");
      }

      this.props.navigate("/customers");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });
        toast.error(ex.response.data);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  render() {
    const { data } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <i className="fa fa-user-circle text-white text-4xl"></i>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">
                {this.props.params.id ? "Edit Customer" : "New Customer"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {this.props.params.id
                  ? "Update customer information"
                  : "Fill in the details to add a customer"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fa fa-user mr-2 text-blue-500"></i>
                  Full Name
                </label>
                <input
                  value={data.name}
                  name="name"
                  onChange={this.handleChange}
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4 
                    ${
                      this.state.errors.name
                        ? "border-red-400 focus:ring-red-100 bg-red-50"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  placeholder="John Doe"
                />
                <AnimatePresence>
                  {this.state.errors.name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1.5 flex items-center">
                      <i className="fa fa-exclamation-circle mr-1"></i>
                      {this.state.errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fa fa-phone mr-2 text-blue-500"></i>
                  Phone Number
                </label>
                <input
                  value={data.phone}
                  name="phone"
                  onChange={this.handleChange}
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4 
                    ${
                      this.state.errors.phone
                        ? "border-red-400 focus:ring-red-100 bg-red-50"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  placeholder="+1 234 567 890"
                />
                <AnimatePresence>
                  {this.state.errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1.5 flex items-center">
                      <i className="fa fa-exclamation-circle mr-1"></i>
                      {this.state.errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Gold Member Toggle */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${data.isGold ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => {
                  const event = {
                    currentTarget: {
                      type: "checkbox",
                      name: "isGold",
                      checked: !data.isGold,
                    },
                  };
                  this.handleChange(event);
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: data.isGold ? 360 : 0 }}
                      transition={{ duration: 0.5 }}>
                      <i
                        className={`fa fa-star text-2xl ${data.isGold ? "text-amber-500" : "text-gray-400"}`}></i>
                    </motion.div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-700">Gold Member</p>
                      <p className="text-xs text-gray-500">
                        Premium customer status
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${data.isGold ? "bg-amber-500" : "bg-gray-300"}`}>
                    <motion.div
                      animate={{ x: data.isGold ? 20 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200">
                  <i className="fa fa-check mr-2"></i>
                  {this.props.params.id ? "Update Customer" : "Create Customer"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => this.props.navigate("/customers")}
                  className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200">
                  <i className="fa fa-arrow-left mr-2"></i>
                  Back to Customers
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(CustomerForm);
