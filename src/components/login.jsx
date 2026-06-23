import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Joi from "joi-browser";
import Form from "./common/form";
import authService from "../services/authService";
import withRouter from "../utils/withRouter";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
    touched: {},
  };

  schema = {
    email: Joi.string().email().min(5).max(255).required().label("Email"),
    password: Joi.string().min(7).max(255).required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await authService.login(data.email, data.password);
      const user = authService.getCurrentUser();
      this.props.onLogin(user);
      const from = this.props.location.state?.from || "/";
      this.props.navigate(from, { replace: true });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = "Invalid email or password";
        this.setState({ errors });
      }
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Navigate to="/movies" replace />;

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
                <i className="fa fa-sign-in text-white text-2xl"></i>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-blue-100 text-sm mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-4">
              {/* Server-side error display */}
              {this.state.errors.email && !this.state.touched.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                  <i className="fa fa-exclamation-circle mr-2"></i>
                  {this.state.errors.email}
                </motion.div>
              )}

              {/* Using renderInput for consistent validation behavior */}
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all mt-2">
                <i className="fa fa-sign-in mr-2"></i>
                Sign In
              </motion.button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:text-blue-700">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(Login);
