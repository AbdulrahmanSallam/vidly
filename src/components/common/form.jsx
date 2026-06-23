import { Component } from "react";
import Joi from "joi-browser";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    touched: {},
  };

  validateAll = () => {
    const { data } = this.state;
    const schema = this.schema;

    if (!schema) return null;

    const options = { abortEarly: false };
    const result = Joi.validate(data, schema, options);

    if (!result.error) return null;

    const errors = {};
    result.error.details.forEach(({ path, message }) => {
      errors[path[0]] = message;
    });

    return errors;
  };

  validateField = (name, value) => {
    const schema = this.schema;
    if (!schema || !schema[name]) return null;

    const fieldSchema = { [name]: schema[name] };
    const result = Joi.validate({ [name]: value }, fieldSchema);
    return result.error ? result.error.details[0].message : null;
  };

  getInputValue = input => {
    const { type, value, checked } = input;
    if (type === "checkbox") return checked;
    if (type === "number") return value === "" ? "" : Number(value);
    return value;
  };

  handleChange = e => {
    const input = e.currentTarget;
    const { name } = input;
    const inputValue = this.getInputValue(input);

    const data = { ...this.state.data, [name]: inputValue };
    const errors = { ...this.state.errors };

    if (this.state.touched[name]) {
      const errorMessage = this.validateField(name, inputValue);
      if (errorMessage) {
        errors[name] = errorMessage;
      } else {
        delete errors[name];
      }
    }

    this.setState({ data, errors });
  };

  handleBlur = e => {
    const input = e.currentTarget;
    const { name } = input;
    const inputValue = this.getInputValue(input);

    const touched = { ...this.state.touched, [name]: true };
    const errors = { ...this.state.errors };

    const errorMessage = this.validateField(name, inputValue);
    if (errorMessage) {
      errors[name] = errorMessage;
    } else {
      delete errors[name];
    }

    this.setState({ errors, touched });
  };

  handleSubmit = e => {
    e.preventDefault();

    const touched = {};
    const schema = this.schema || {};
    Object.keys(schema).forEach(key => {
      if (key !== "_id") {
        touched[key] = true;
      }
    });

    const errors = this.validateAll();
    this.setState({ errors: errors || {}, touched });

    if (errors) return;
    this.doSubmit();
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors, touched } = this.state;
    const value = data[name] ?? "";
    const error = touched[name] ? errors[name] : undefined;

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <input
          id={name}
          name={name}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          type={type}
          autoComplete="off"
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 focus:ring-4
            ${
              error
                ? "border-red-400 focus:ring-red-100 bg-red-50"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <i className="fa fa-exclamation-circle mr-1.5"></i>
            {error}
          </p>
        )}
      </div>
    );
  };

  renderSelect = (name, label, options, labelProperty = "name") => {
    const { data, errors, touched } = this.state;
    const value = data[name] || "";
    const error = touched[name] ? errors[name] : undefined;

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 focus:ring-4 bg-white
            ${
              error
                ? "border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
            }`}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option._id} value={option._id}>
              {option[labelProperty]}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <i className="fa fa-exclamation-circle mr-1.5"></i>
            {error}
          </p>
        )}
      </div>
    );
  };

  renderCheckbox = (name, label) => {
    const { data } = this.state;
    const checked = data[name] || false;

    return (
      <div
        onClick={() => {
          this.handleChange({
            currentTarget: { type: "checkbox", name, checked: !checked },
          });
        }}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
          ${checked ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i
              className={`fa fa-star text-xl transition-colors ${checked ? "text-amber-500" : "text-gray-400"}`}
            />
            <div>
              <p className="font-semibold text-gray-700">{label}</p>
              <p className="text-xs text-gray-500">
                {checked ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <div
            className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? "bg-amber-500" : "bg-gray-300"}`}>
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>
    );
  };

  renderButton = label => (
    <button
      type="submit"
      className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 cursor-pointer">
      <i className="fa fa-save mr-2"></i>
      {label}
    </button>
  );

  renderBackButton = (onClick, label = "Back") => (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 mt-2 cursor-pointer">
      <i className="fa fa-arrow-left mr-2"></i>
      {label}
    </button>
  );

  render() {
    return null;
  }
}

export default Form;
