import { Component } from "react";

import Like from "./common/like";
import Table from "./common/table";

class MoviesTable extends Component {
  state = {};

  columns = [
    { path: "title", label: "Title" },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: item => (
        <Like liked={item.liked} onClick={() => this.props.onLike(item)}></Like>
      ),
    },
    {
      key: "delete",
      content: item => (
        <button
          onClick={() => this.props.onDelete(item._id)}
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
