import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Movie from "./movie";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate.js";
import { getGenres } from "../services/fakeGenreService.js";

class Movies extends Component {
  state = {
    movies: getMovies(),
    genres: getGenres(),
    genre: "",
    currentPage: 1,
    pageSize: 2,
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreChange = genre => {
    this.setState({ genre });
  };

  render() {
    const { pageSize, currentPage, movies: allMovies } = this.state;
    const { genres, genre } = this.state;

    const filteredMovies = genre
      ? allMovies.filter(movie => movie.genre.name === genre)
      : allMovies;

    const itemsCount = filteredMovies.length;

    const movies = paginate(filteredMovies, currentPage, pageSize);

    return (
      <section className="container pt-4">
        <div className="row">
          <div className="col-2">
            <div className="list-group">
              <a
                onClick={() => this.handleGenreChange("")}
                className="list-group-item list-group-item-action active"
                aria-current="true">
                All Genres
              </a>
              {genres.map(genre => (
                <a
                  key={genre._id}
                  onClick={() => this.handleGenreChange(genre.name)}
                  className="list-group-item list-group-item-action"
                  aria-current="true">
                  {genre.name}
                </a>
              ))}
            </div>
          </div>
          <div className="col">
            <p>Showing {movies.length} movies</p>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Stock</th>
                  <th>Rate</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <Movie
                    key={movie._id}
                    movie={movie}
                    handleLike={this.handleLike}
                    handleDelete={this.handleDelete}></Movie>
                ))}
              </tbody>
            </table>
            <Pagination
              itemsCount={itemsCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}></Pagination>
          </div>
        </div>{" "}
      </section>
    );
  }
}

export default Movies;
