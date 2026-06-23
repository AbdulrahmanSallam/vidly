import Joi from "joi-browser";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Form from "./common/form";
import * as userService from "../services/userService";
import authService from "../services/authService";
import withRouter from "../utils/withRouter";

class Register extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: "",
    },
    errors: {},
    touched: {},
  };

  schema = {
    name: Joi.string().required().label("User Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().min(7).label("Password"),
  };

  doSubmit = async () => {
    try {
      const result = await userService.register(this.state.data);
      const jwt = result.headers["x-auth-token"];
      authService.loginWithJwt(jwt);
      window.location = "/movies";
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = err.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-user-plus text-white text-2xl"></i>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-blue-100 text-sm mt-1">Join Vidly today</p>
            </div>

            {/* Form */}
            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-4">
              {/* Using renderInput for consistent validation behavior */}
              {this.renderInput("name", "Full Name")}
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all mt-2">
                <i className="fa fa-user-plus mr-2"></i>
                Create Account
              </motion.button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(Register);
