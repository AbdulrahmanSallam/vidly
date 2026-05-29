import { Component } from "react";

import Movie from "./movie";

class MoviesTable extends Component {
  state = {};

  raiseSort(path) {
    const sortColumn = { ...this.props.sortColumn };

    if (path === sortColumn.path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    this.props.onSort(sortColumn);
  }

  render() {
    const { movies, onLike, onDelete } = this.props;

    return (
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => this.raiseSort("title")} role="button">
              Title
            </th>
            <th onClick={() => this.raiseSort("genre.name")} role="button">
              Genre
            </th>
            <th onClick={() => this.raiseSort("numberInStock")} role="button">
              Stock
            </th>
            <th onClick={() => this.raiseSort("dailyRentalRate")} role="button">
              Rate
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <Movie
              key={movie._id}
              movie={movie}
              onLike={onLike}
              onDelete={onDelete}></Movie>
          ))}
        </tbody>
      </table>
    );
  }
}

export default MoviesTable;
