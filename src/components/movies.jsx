import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Movie from "./movie";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate.js";

class Movies extends Component {
  state = {
    movies: getMovies(),
    currentPage: 1,
    pageSize: 3,
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

  render() {
    const { pageSize, currentPage, movies: allMovies } = this.state;
    const itemsCount = this.state.movies.length;

    const movies = paginate(allMovies, currentPage, pageSize);
    return (
      <section className="container pt-4">
        <p>Showing {this.state.movies.length} movies</p>
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
      </section>
    );
  }
}

export default Movies;
