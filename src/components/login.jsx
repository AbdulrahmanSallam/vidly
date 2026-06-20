import Joi from "joi-browser";
import Form from "./common/form";
import authService from "../services/authService";
import withRouter from "../utils/withRouter";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().email().min(5).max(255).required().label("Email"),
    password: Joi.string().min(7).max(255).required().label("Password"),
  };

  doSubmit = async () => {
    try {
      console.log(this.state.data);
      const { data } = this.state;
      await authService.login(data.email, data.password);
      window.location = "/";
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = "Invalid Email or Password.";
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email")}
            {this.renderInput("password", "Password", "password")}
            {this.renderButton("Login")}
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(Login);
