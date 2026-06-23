import Joi from "joi-browser";
import { motion } from "framer-motion";
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
    touched: {},
    genres: [],
  };

  schema = {
    title: Joi.string().min(5).required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().integer().min(0).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).required().label("Rate"),
    _id: Joi.string(),
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

            <form onSubmit={this.handleSubmit} className="px-6 py-6 space-y-5">
              {this.renderInput("title", "Title")}
              {this.renderSelect("genreId", "Genre", this.state.genres, "name")}

              <div className="grid grid-cols-2 gap-4">
                {this.renderInput("numberInStock", "Stock", "number")}
                {this.renderInput("dailyRentalRate", "Rate", "number")}
              </div>

              <div className="space-y-3 pt-2">
                {this.renderButton(
                  this.props.params.id ? "Update Movie" : "Create Movie",
                )}
                {this.renderBackButton(() => this.props.navigate("/movies"))}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(MovieForm);
