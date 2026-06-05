const Input = ({ name, label, error, type, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        {...rest}
        type={type}
        name={name}
        id={name}
        className="form-control"
      />
      {error && <div className="alert alert-danger small">{error}</div>}
    </div>
  );
};

export default Input;
