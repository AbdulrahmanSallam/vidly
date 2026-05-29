import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Route, Routes } from "react-router-dom";
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import Navbar from "./components/navbar";
import MovieForm from "./components/movie-form";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <main>
        <Routes>
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

export default App;
