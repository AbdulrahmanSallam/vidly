import Movie from "./movie";

const MoviesTable = ({ movies, onLike, onDelete }) => {
  return (
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
            onLike={onLike}
            onDelete={onDelete}></Movie>
        ))}
      </tbody>
    </table>
  );
};

export default MoviesTable;
