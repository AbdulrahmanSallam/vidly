import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import withRouter from "../utils/withRouter";

class Register extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("User Name"),
    email: Joi.string().email().email().required().label("Email"),
    password: Joi.string().required().min(7).label("Password"),
  };

  doSubmit = async () => {
    try {
      const result = await userService.register(this.state.data);
      const jwt = result.headers["x-auth-token"];
      localStorage.setItem("token", jwt);
      this.props.navigate("/movies");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = err.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name")}
            {this.renderInput("email", "Email")}
            {this.renderInput("password", "Password", "password")}

            {this.renderButton("Register")}
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(Register);
