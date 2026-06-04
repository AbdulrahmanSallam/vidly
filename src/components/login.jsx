import { Component } from "react";

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
            <div className="mb-4">
              <label htmlFor="userName" className="form-label">
                User name
              </label>
              <input
                onChange={this.handleChange}
                value={this.state.userName}
                autoFocus
                type="text"
                name="userName"
                id="userName"
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
                name="password"
                id="password"
                className="form-control"
              />
            </div>
            <button className="btn btn-primary">Login</button>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
