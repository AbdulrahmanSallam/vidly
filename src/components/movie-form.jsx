import Joi from "joi-browser";
import withRouter from "../utils/withRouter";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";

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
    title: Joi.string().min(5).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().integer().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    _id: Joi.string(),
    publishDate: Joi.date(),
    liked: Joi.boolean(),
  };

  async populateGenres() {
    const { data } = await getGenres();
    this.setState({ genres: data });
  }

  async populateMovies() {
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
    await this.populateMovies();
  }

  mapToMovieModel = movie => {
    return {
      _id: movie._id,
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
      genreId: movie.genre?._id || movie.genreId,
    };
  };

  doSubmit = async () => {
    try {
      const movieId = this.props.params.id;

      const movieData = { ...this.state.data };

      if (movieId) {
        movieData._id = movieId;
        await saveMovie(movieData);
      } else {
        // ✅ For new movies, remove _id if it exists
        delete movieData._id;
        await saveMovie(movieData);
      }

      this.props.navigate("/movies");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.title = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <h1>Movie Form</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("title", "Title")}
            {this.renderSelect("genreId", "Genre", this.state.genres)}
            {this.renderInput("numberInStock", "Number in stock", "number")}
            {this.renderInput("dailyRentalRate", "Rate", "number")}

            {this.renderButton("Save")}
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(MovieForm);
