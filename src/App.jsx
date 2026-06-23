import { Route, Routes, Navigate } from "react-router-dom";
import { Component, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/navbar";
import authService from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import LoadingScreen from "./components/common/loadingScreen";

// Lazy loaded components for better performance
const Movies = lazy(() => import("./components/movies"));
const Customers = lazy(() => import("./components/customers"));
const CustomerForm = lazy(() => import("./components/customerForm"));
const Rentals = lazy(() => import("./components/rentals"));
const RentalForm = lazy(() => import("./components/rentalForm"));
const MovieForm = lazy(() => import("./components/movieForm"));
const Login = lazy(() => import("./components/login"));
const Register = lazy(() => import("./components/register"));
const Logout = lazy(() => import("./components/logout"));
const NotFound = lazy(() => import("./components/notFound"));

// Page transition animation
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

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

    if (loading) return <LoadingScreen />;

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={this.handleLogout} />

        <main className="relative">
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Login onLogin={this.handleLogin} user={user} />
                    </motion.div>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Register />
                    </motion.div>
                  }
                />
                <Route
                  path="/logout"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Logout onLogout={this.handleLogout} />
                    </motion.div>
                  }
                />

                {/* Protected Routes - Require Authentication */}
                <Route element={<ProtectedRoute user={user} />}>
                  {/* Movie Form Routes */}
                  <Route
                    path="/movies/new"
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}>
                        <MovieForm />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/movies/:id"
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}>
                        <MovieForm />
                      </motion.div>
                    }
                  />

                  {/* Customer Form Routes */}
                  <Route
                    path="/customers/new"
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}>
                        <CustomerForm />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/customers/:id"
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}>
                        <CustomerForm />
                      </motion.div>
                    }
                  />

                  {/* Rental Form Route */}
                  <Route
                    path="/rentals/new"
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}>
                        <RentalForm />
                      </motion.div>
                    }
                  />
                </Route>

                {/* Public List Routes */}
                <Route
                  path="/movies"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Movies user={user} />
                    </motion.div>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Customers user={user} />
                    </motion.div>
                  }
                />
                <Route
                  path="/rentals"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <Rentals user={user} />
                    </motion.div>
                  }
                />

                {/* Redirect & 404 */}
                <Route path="/" element={<Navigate to="/movies" replace />} />
                <Route
                  path="*"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}>
                      <NotFound />
                    </motion.div>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    );
  }
}

export default App;
