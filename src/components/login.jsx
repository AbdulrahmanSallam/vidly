import { Component } from "react";
import Input from "./common/input";

class Login extends Component {
  state = {
    account: {
      userName: "",
      password: "",
    },
    errors: {},
  };

  validate = () => {
    const { account } = this.state;
    const errors = {};

    if (!account.userName.trim()) errors.userName = "User name is required";
    if (!account.password.trim()) errors.password = "Password is required";

    return Object.keys(errors).length ? errors : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors });
    console.log(errors);

    if (errors) return null;

    console.log("submitted");
  };

  handleChange = e => {
    const state = { ...this.state };
    state.account[e.currentTarget.name] = e.currentTarget.value;
    this.setState(state);
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <Input
              onChange={this.handleChange}
              value={this.state.name}
              name="userName"
              label="User name"></Input>

            <Input
              onChange={this.handleChange}
              value={this.state.password}
              name="password"
              label="Password"
              type="password"></Input>

            <button className="btn btn-primary">Login</button>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
