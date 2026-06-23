import Joi from "joi-browser";
import { motion } from "framer-motion";
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
    touched: {},
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
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
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

            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-5">
              {this.renderInput("name", "Full Name")}
              {this.renderInput("phone", "Phone Number")}
              {this.renderCheckbox("isGold", "Gold Member")}

              <div className="space-y-3 pt-2">
                {this.renderButton(
                  this.props.params.id ? "Update Customer" : "Create Customer",
                )}
                {this.renderBackButton(() => this.props.navigate("/customers"))}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(CustomerForm);
