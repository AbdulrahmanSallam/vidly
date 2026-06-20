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
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().integer().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    _id: Joi.string(),
    publishDate: Joi.date(),
    liked: Joi.boolean(),
  };

  async populateGenres() {
    const { data } = await getGenres();
    console.log("genres", data);
    this.setState({ genres: data });
  }

  async populateMovies() {
    try {
      const movieId = this.props.params.id;
      if (!movieId) return;
      const movie = await getMovie();
      this.setState({ data: this.mapToMovieModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
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
      genreId: movie.genre._id,
    };
  };

  doSubmit = async () => {
    let res = [];
    console.log(res);
    if (this.id) {
      await saveMovie({ _id: this.id, ...this.state.data }).data;
    } else {
      await saveMovie(this.state.data).data;
    }
    console.log(res);

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
