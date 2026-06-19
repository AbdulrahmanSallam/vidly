import { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";

class Form extends Component {
  state = { data: {}, errors: {} };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};

    error.details.map(error => {
      errors[error.path[0]] = error.message;
    });

    return Object.keys(errors).length ? errors : null;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    } else {
      delete errors[input.name];
    }

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return null;

    this.doSubmit();
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        value={data[name]}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        type={type}></Input>
    );
  };

  renderSelect = (name, label, options) => {
    return (
      <div className="mb-4">
        <label htmlFor={name}>{label}</label>
        <select
          onChange={this.handleChange}
          value={this.state.data.genreId}
          name={name}
          id={name}
          className="form-select">
          <option value="">select {label.toLocaleLowerCase()}</option>
          {options.map(option => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  renderButton = label => (
    <button disabled={this.validate()} className="btn btn-primary">
      {label}
    </button>
  );
}

export default Form;
