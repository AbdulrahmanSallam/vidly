import Like from "./common/like";

const Movie = props => {
  const { movie, handleLike, handleDelete } = props;
  return (
    <tr>
      <td>{movie.title}</td>
      <td>{movie.genre?.name}</td>
      <td>{movie.numberInStock}</td>
      <td>{movie.dailyRentalRate}</td>
      <td>
        <Like liked={movie.liked} onClick={() => handleLike(movie)}></Like>
      </td>
      <td>
        <button
          onClick={() => handleDelete(movie._id)}
          className="btn btn-danger btn-small">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Movie;
