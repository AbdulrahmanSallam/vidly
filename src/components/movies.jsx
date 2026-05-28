import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";

import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate.js";
import { getGenres } from "../services/fakeGenreService.js";
import ListGroup from "./common/listGroup.jsx";
import MoviesTable from "./movies-table.jsx";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: {},
    currentPage: 1,
    pageSize: 3,
  };

  componentDidMount() {
    const defaultGenre = { _id: "", name: "All genres" };
    const genres = [defaultGenre, ...getGenres()];

    this.setState({ movies: getMovies(), genres, selectedGenre: defaultGenre });
  }

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

  handleGenreChange = selectedGenre => {
    this.setState({ selectedGenre, currentPage: 1 });
  };

  render() {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
    } = this.state;

    if (allMovies.length == 0) return <p>There is no movies</p>;

    const filteredMovies =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(movie => movie.genre._id === selectedGenre._id)
        : allMovies;

    const itemsCount = filteredMovies.length;

    const movies = paginate(filteredMovies, currentPage, pageSize);

    return (
      <section className="container pt-4">
        <div className="row">
          <div className="col-2">
            <ListGroup
              items={this.state.genres}
              selectedItem={selectedGenre}
              onItemSelected={this.handleGenreChange}></ListGroup>
          </div>
          <div className="col">
            <p>Showing {movies.length} movies</p>

            <MoviesTable
              movies={movies}
              onLike={this.handleLike}
              onDelete={this.handleDelete}></MoviesTable>
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
