import { Route, Routes } from "react-router-dom";
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

class App extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    const user = authService.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <>
        <Navbar user={this.state.user}></Navbar>
        <main>
          <Routes>
            <Route path="/login" Component={Login}></Route>
            <Route path="/logout" Component={Logout}></Route>
            <Route path="/register" Component={Register}></Route>
            <Route path="/movies/new" Component={MovieForm}></Route>
            <Route path="/movies/:id" Component={MovieForm}></Route>
            <Route path="/movies" Component={Movies}></Route>
            <Route path="/customers" Component={Customers}></Route>
            <Route path="/rentals" Component={Rentals}></Route>
            <Route path="/not-found" Component={NotFound}></Route>
            <Route path="/" Component={Movies}></Route>
            <Route path="*" Component={NotFound}></Route>
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
