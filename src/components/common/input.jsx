const Input = ({ name, label, type = "text", ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        {...rest}
        autoFocus
        type={type}
        name={name}
        id={name}
        className="form-control"
      />
    </div>
  );
};

export default Input;
