import { Component } from "react";
import { paginate } from "../utils/paginate.js";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup.jsx";
import MoviesTable from "./movies-table.jsx";
import _ from "lodash";
import { NavLink } from "react-router-dom";
import SearchBox from "./common/search.jsx";
import { getGenres } from "../services/genreService.js";
import { deleteMovie, getMovies } from "../services/movieService.js";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    currentPage: 1,
    pageSize: 3,
  };

  async populateGenres() {
    const { data } = await getGenres();
    const defaultGenre = { _id: "", name: "All genres" };
    const genres = [defaultGenre, ...data];

    this.setState({ genres, selectedGenre: defaultGenre });
  }

  async populateMovies() {
    const { data: movies } = await getMovies();

    this.setState({ movies });
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovies();
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = this.state.movies.filter(m => m._id != movie.id);

    this.setState({ movies: movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted.");
      }
      this.setState({ movies: originalMovies });
    }
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
    this.setState({ selectedGenre, currentPage: 1, searchQuery: "" });
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
      searchQuery,
    } = this.state;

    let filteredMovies = allMovies;

    if (searchQuery) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else if (selectedGenre && selectedGenre._id) {
      filteredMovies = filteredMovies.filter(
        movie => movie.genre._id === selectedGenre._id,
      );
    }

    const sortedMovies = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order],
    );

    const movies = paginate(sortedMovies, currentPage, pageSize);

    return { data: movies, totalCount: filteredMovies?.length };
  };

  handleSearch = ({ currentTarget }) => {
    this.setState({
      searchQuery: currentTarget.value,
      selectedGenre: null,
      currentPage: 1,
    });
  };

  render() {
    const moviesCount = this.state.movies?.length;

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
            <NavLink to={"/movies/new"} className="btn btn-primary mb-3">
              New movie
            </NavLink>

            <p>Showing {data.length} movies</p>

            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}></SearchBox>

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
