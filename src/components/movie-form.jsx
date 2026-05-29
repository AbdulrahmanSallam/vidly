import { Component } from "react";
import withRouter from "../utils/withRouter";

class MovieForm extends Component {
  state = {};

  render() {
    return (
      <section>
        <h1>MovieForm {this.props.params.id}</h1>
        <button onClick={() => this.props.navigate("/movies")}>Save</button>
      </section>
    );
  }
}

export default withRouter(MovieForm);
