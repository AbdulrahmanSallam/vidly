import Joi from "joi-browser";
import { motion } from "framer-motion";
import withRouter from "../utils/withRouter";
import Form from "./common/form";
import { getCustomers } from "../services/customerService";
import { getMovies } from "../services/movieService";
import { saveRental } from "../services/rentalService";
import { toast } from "react-toastify";

class RentalForm extends Form {
  state = {
    data: {
      customerId: "",
      movieId: "",
    },
    errors: {},
    touched: {},
    customers: [],
    movies: [],
  };

  schema = {
    customerId: Joi.string().required().label("Customer"),
    movieId: Joi.string().required().label("Movie"),
  };

  async populateData() {
    const [customersRes, moviesRes] = await Promise.all([
      getCustomers(),
      getMovies(),
    ]);

    const availableMovies = moviesRes.data.filter(m => m.numberInStock > 0);

    this.setState({
      customers: customersRes.data,
      movies: availableMovies,
    });
  }

  async componentDidMount() {
    await this.populateData();
  }

  doSubmit = async () => {
    try {
      await saveRental(this.state.data);
      toast.success("Rental created successfully!");
      this.props.navigate("/rentals");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      } else if (ex.response && ex.response.status === 404) {
        toast.error("Invalid customer or movie");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <i className="fa fa-ticket text-white text-4xl"></i>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">New Rental</h2>
              <p className="text-blue-100 text-sm mt-1">
                Select a customer and movie to create a rental
              </p>
            </div>

            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-5">
              {this.renderSelect(
                "customerId",
                "Customer",
                this.state.customers,
                "name",
              )}
              {this.renderSelect(
                "movieId",
                "Movie",
                this.state.movies,
                "title",
              )}

              <div className="space-y-3 pt-2">
                {this.renderButton("Create Rental")}
                {this.renderBackButton(() => this.props.navigate("/rentals"))}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(RentalForm);
