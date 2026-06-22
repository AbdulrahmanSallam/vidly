import { Component } from "react";
import { Navigate } from "react-router-dom";

class Logout extends Component {
  state = {
    done: false,
  };

  componentDidMount() {
    this.props.onLogout();
    this.setState({ done: true });
  }

  render() {
    if (this.state.done) {
      return <Navigate to="/login" replace />;
    }
    return null;
  }
}

export default Logout;
