import Joi from "joi-browser";
import withRouter from "../utils/withRouter";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";

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
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
    _id: Joi.string(),
    publishDate: Joi.date(),
    liked: Joi.boolean(),
  };

  componentDidMount() {
    const genres = getGenres();
    this.setState({ genres });

    const movieId = this.props.params.id;

    if (movieId) {
      const movie = getMovie(movieId);
      if (!movie) return this.props.navigate("/not-found", { replace: true });
      this.setState({ data: this.mapToMovieModel(movie) });
    }
  }

  mapToMovieModel = movie => {
    return {
      _id: movie._id,
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
      genreId: movie.genre._id,
    };
  };

  doSubmit = () => {
    if (this.id) {
      saveMovie({ _id: this.id, ...this.state.data });
    } else {
      saveMovie(this.state.data);
    }

    this.props.navigate("/movies");
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
