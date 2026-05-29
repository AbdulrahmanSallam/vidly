import { Component } from "react";

import Like from "./common/like";
import Table from "./common/table";
import { Link } from "react-router-dom";

class MoviesTable extends Component {
  state = {};

  columns = [
    {
      path: "title",
      label: "Title",
      content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link>,
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: mvoie => (
        <Like
          liked={mvoie.liked}
          onClick={() => this.props.onLike(mvoie)}></Like>
      ),
    },
    {
      key: "delete",
      content: mvoie => (
        <button
          onClick={() => this.props.onDelete(mvoie._id)}
          className="btn btn-danger btn-small">
          Delete
        </button>
      ),
    },
  ];

  render() {
    const { movies, sortColumn, onSort } = this.props;

    return (
      <Table
        data={movies}
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}></Table>
    );
  }
}

export default MoviesTable;
