import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { paginate } from "../utils/paginate.js";
import { getGenres } from "../services/fakeGenreService.js";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup.jsx";
import MoviesTable from "./movies-table.jsx";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: {},
    sortColumn: { path: "title", order: "asc" },
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

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
    } = this.state;

    const filteredMovies =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(movie => movie.genre._id === selectedGenre._id)
        : allMovies;

    const sortedMovies = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order],
    );

    const movies = paginate(sortedMovies, currentPage, pageSize);

    return { data: movies, totalCount: filteredMovies.length };
  };

  render() {
    const moviesCount = this.state.movies.length;

    if (moviesCount == 0) return <p>There is no movies</p>;

    const { totalCount, data } = this.getPagedData();

    const { pageSize, currentPage, selectedGenre } = this.state;
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
            <p>Showing {data.length} movies</p>

            <MoviesTable
              movies={data}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              sortColumn={this.state.sortColumn}
              onSort={this.handleSort}></MoviesTable>

            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}></Pagination>
          </div>
        </div>
      </section>
    );
  }
}

export default Movies;
