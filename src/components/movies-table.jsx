import { Component } from "react";
import Movie from "./movie";
import TableHeader from "./common/tableHeader";

class MoviesTable extends Component {
  state = {};

  columns = [
    { path: "title", label: "Title" },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    { key: "like" },
    { key: "delete" },
  ];

  render() {
    const { movies, onLike, onDelete, sortColumn, onSort } = this.props;

    return (
      <table className="table">
        <TableHeader
          columns={this.columns}
          sortColumn={sortColumn}
          onSort={onSort}></TableHeader>

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
