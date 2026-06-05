import Joi from "joi-browser";
import Form from "./common/form";

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
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().email().required().label("Email"),
    password: Joi.string().required().min(7).label("Password"),
  };

  doSubmit = e => {
    this.handleSubmit(e);
  };

  render() {
    return (
      <section className="py-4">
        <div className="container">
          <form onSubmit={this.doSubmit}>
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

export default Register;
