import { Route, Routes, Navigate } from "react-router-dom";
import { Component } from "react";
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import Navbar from "./components/navbar";
import MovieForm from "./components/movie-form";
import Login from "./components/login";
import Register from "./components/register";
import Logout from "./components/logout";
import authService from "./services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProtectedRoute from "./components/common/protectedRoute";

class App extends Component {
  state = {
    user: null,
    loading: true,
  };

  componentDidMount() {
    const user = authService.getCurrentUser();
    this.setState({ user, loading: false });
  }

  handleLogin = user => {
    this.setState({ user });
  };

  handleLogout = () => {
    authService.logout();
    this.setState({ user: null });
  };

  render() {
    const { user, loading } = this.state;

    if (loading) return null;

    return (
      <>
        <Navbar user={user} onLogout={this.handleLogout} />
        <main>
          <Routes>
            <Route
              path="/login"
              element={<Login onLogin={this.handleLogin} user={user} />}
            />
            <Route
              path="/logout"
              element={<Logout onLogout={this.handleLogout} />}
            />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/movies/new" element={<MovieForm />} />
              <Route path="/movies/:id" element={<MovieForm />} />
            </Route>
            <Route path="/movies" element={<Movies user={user} />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/" element={<Navigate to="/movies" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
