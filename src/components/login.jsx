import Joi from "joi-browser";
import Form from "./common/form";

class Login extends Form {
  state = {
    data: {
      userName: "",
      password: "",
    },
    errors: {},
  };

  scehma = {
    userName: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = () => {
    console.log("submitted");
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("userName", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderButton("Login")}
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
