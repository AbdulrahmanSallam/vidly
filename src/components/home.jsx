import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Movies from "./movies";

class Home extends Component {
  state = {
    movies: getMovies(),
  };

  handleDelete = id => {
    const movies = this.state.movies.filter(m => m._id != id);

    this.setState({ movies: movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movie.liked;

    this.setState({ movies });
  };

  render() {
    return (
      <section className="container">
        <Movies
          movies={this.state.movies}
          handleLike={this.handleLike}
          handleDelete={this.handleDelete}></Movies>
      </section>
    );
  }
}

export default Home;
