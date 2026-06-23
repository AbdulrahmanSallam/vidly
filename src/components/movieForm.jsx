import Joi from "joi-browser";
import { motion, AnimatePresence } from "framer-motion";
import withRouter from "../utils/withRouter";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { toast } from "react-toastify";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: 0,
      dailyRentalRate: 0,
    },
    errors: {},
    genres: [],
  };

  schema = {
    title: Joi.string().min(5).required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().integer().min(0).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).required().label("Rate"),
    _id: Joi.string(),
    publishDate: Joi.date(),
    liked: Joi.boolean(),
  };

  async populateGenres() {
    const { data } = await getGenres();
    this.setState({ genres: data });
  }

  async populateMovie() {
    try {
      const movieId = this.props.params.id;
      if (!movieId) return;
      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToMovieModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        return this.props.navigate("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  mapToMovieModel = movie => ({
    _id: movie._id,
    title: movie.title,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
    genreId: movie.genre?._id || movie.genreId,
  });

  doSubmit = async () => {
    try {
      const movieId = this.props.params.id;
      const movieData = { ...this.state.data };

      if (movieId) {
        movieData._id = movieId;
        await saveMovie(movieData);
        toast.success("Movie updated!");
      } else {
        delete movieData._id;
        await saveMovie(movieData);
        toast.success("Movie created!");
      }

      this.props.navigate("/movies");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.title = ex.response.data;
        this.setState({ errors });
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    const { data } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <i className="fa fa-film text-white text-4xl"></i>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">
                {this.props.params.id ? "Edit Movie" : "New Movie"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {this.props.params.id
                  ? "Update movie details"
                  : "Add a new movie to catalog"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fa fa-film mr-2 text-blue-500"></i>Title
                </label>
                <input
                  value={data.title}
                  name="title"
                  onChange={this.handleChange}
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4
                    ${this.state.errors.title ? "border-red-400 focus:ring-red-100 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                  placeholder="Enter movie title"
                />
                <AnimatePresence>
                  {this.state.errors.title && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1.5">
                      {this.state.errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fa fa-tags mr-2 text-blue-500"></i>Genre
                </label>
                <select
                  name="genreId"
                  value={data.genreId}
                  onChange={this.handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4
                    ${this.state.errors.genreId ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}>
                  <option value="">Select genre</option>
                  {this.state.genres.map(genre => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {this.state.errors.genreId && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1.5">
                      {this.state.errors.genreId}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Stock & Rate Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fa fa-box mr-2 text-blue-500"></i>Stock
                  </label>
                  <input
                    value={data.numberInStock}
                    name="numberInStock"
                    onChange={this.handleChange}
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4
                      ${this.state.errors.numberInStock ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fa fa-dollar mr-2 text-blue-500"></i>Rate
                  </label>
                  <input
                    value={data.dailyRentalRate}
                    name="dailyRentalRate"
                    onChange={this.handleChange}
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-4
                      ${this.state.errors.dailyRentalRate ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all">
                  <i className="fa fa-save mr-2"></i>
                  {this.props.params.id ? "Update Movie" : "Create Movie"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => this.props.navigate("/movies")}
                  className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">
                  <i className="fa fa-arrow-left mr-2"></i>Back
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(MovieForm);
