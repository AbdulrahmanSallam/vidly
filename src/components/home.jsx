import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";

class Home extends Component {
  state = {
    movies: getMovies(),
  };

  render() {
    return (
      <section className="container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.state.movies.map(movie => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.genre?.name}</td>
                <td>{movie.numberInStock}</td>
                <td>{movie.dailyRentalRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default Home;
