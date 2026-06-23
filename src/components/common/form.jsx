// components/common/form.jsx
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

    // Handle different input types
    if (input.type === "checkbox") {
      data[input.name] = input.checked;
    } else if (input.type === "number") {
      data[input.name] = input.value === "" ? "" : Number(input.value);
    } else {
      data[input.name] = input.value;
    }

    this.setState({ data, errors });
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return null;

    this.doSubmit();
  };

  renderInput = (name, label, type = "text", icon = null) => {
    const { data, errors } = this.state;
    return (
      <Input
        value={data[name] || ""}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        type={type}
        icon={icon}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    );
  };

  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;
    return (
      <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
          <i className="fa fa-list me-2 text-primary"></i>
          {label}
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light">
            <i className="fa fa-list text-muted"></i>
          </span>
          <select
            onChange={this.handleChange}
            value={data[name] || ""}
            name={name}
            id={name}
            className={`form-select ${errors[name] ? "is-invalid" : ""}`}
            style={{
              borderRadius: "0 8px 8px 0",
              padding: "10px 15px",
            }}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(option => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors[name] && (
            <div className="invalid-feedback d-block">
              <i className="fa fa-exclamation-circle me-1"></i>
              {errors[name]}
            </div>
          )}
        </div>
      </div>
    );
  };

  renderCheckbox = (name, label) => {
    const { data } = this.state;
    return (
      <div className="mb-4">
        <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id={name}
              name={name}
              checked={data[name] || false}
              onChange={this.handleChange}
              style={{
                width: "3em",
                height: "1.5em",
                cursor: "pointer",
              }}
            />
          </div>
          <label
            className="form-check-label ms-3 fw-semibold"
            htmlFor={name}
            style={{ cursor: "pointer" }}>
            <i
              className={`fa fa-star me-2 ${data[name] ? "text-warning" : "text-muted"}`}></i>
            {label}
          </label>
          {data[name] && (
            <span className="badge bg-warning text-dark ms-auto">
              <i className="fa fa-star me-1"></i>
              Active
            </span>
          )}
        </div>
      </div>
    );
  };

  renderButton = label => (
    <button
      disabled={this.validate()}
      className="btn btn-primary btn-lg w-100 shadow-sm"
      style={{
        transition: "all 0.3s ease",
        borderRadius: "10px",
        padding: "12px 0",
        fontSize: "1.1rem",
      }}>
      <i className="fa fa-save me-2"></i>
      {label}
    </button>
  );

  renderCancelButton = (onClick, label = "Cancel") => (
    <button
      type="button"
      className="btn btn-outline-secondary btn-lg w-100 mt-2"
      onClick={onClick}
      style={{
        borderRadius: "10px",
        padding: "12px 0",
      }}>
      <i className="fa fa-times me-2"></i>
      {label}
    </button>
  );
}

export default Form;
