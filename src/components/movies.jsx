import Movie from "./movie";

const Movies = props => {
  const { movies, handleLike, handleDelete } = props;
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
            handleLike={handleLike}
            handleDelete={handleDelete}></Movie>
        ))}
      </tbody>
    </table>
  );
};

export default Movies;
