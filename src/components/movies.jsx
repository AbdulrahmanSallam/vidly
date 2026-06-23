import { Component } from "react";
import { motion } from "framer-motion";
import { paginate } from "../utils/paginate.js";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup.jsx";
import MoviesTable from "./moviesTable.jsx";
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
    try {
      const movies = this.state.movies.filter(m => m._id !== movie._id);
      this.setState({ movies });
      await deleteMovie(movie._id);
      toast.success("Movie deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted.");
      }
      this.setState({ movies: originalMovies });
    }
  };

  handlePageChange = page => this.setState({ currentPage: page });
  handleGenreChange = selectedGenre =>
    this.setState({ selectedGenre, currentPage: 1, searchQuery: "" });
  handleSort = sortColumn => this.setState({ sortColumn });

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
    const { user } = this.props;
    const { totalCount, data } = this.getPagedData();
    const { pageSize, currentPage, selectedGenre } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar - Genre List */}
            <div className="w-48 shrink-0 hidden lg:block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Genres
                </h3>
                <ListGroup
                  items={this.state.genres}
                  selectedItem={selectedGenre}
                  onItemSelected={this.handleGenreChange}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <i className="fa fa-film text-blue-600 mr-3"></i>
                    Movies
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {data.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {totalCount}
                    </span>{" "}
                    movies
                  </p>
                </div>
                {user && (
                  <NavLink
                    to="/movies/new"
                    className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all duration-200">
                    <i className="fa fa-plus mr-2"></i>
                    New Movie
                  </NavLink>
                )}
              </div>

              {/* Mobile Genre Select */}
              <div className="lg:hidden mb-4">
                <select
                  onChange={e => {
                    const genre = this.state.genres.find(
                      g => g._id === e.target.value,
                    );
                    this.handleGenreChange(genre);
                  }}
                  value={selectedGenre?._id || ""}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none">
                  {this.state.genres.map(genre => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="mb-4">
                    <SearchBox
                      value={this.state.searchQuery}
                      onChange={this.handleSearch}
                    />
                  </div>

                  <MoviesTable
                    movies={data}
                    onDelete={this.handleDelete}
                    sortColumn={this.state.sortColumn}
                    onSort={this.handleSort}
                  />

                  {totalCount > pageSize && (
                    <div className="mt-6">
                      <Pagination
                        itemsCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default Movies;
