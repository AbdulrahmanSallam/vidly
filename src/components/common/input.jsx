const Input = ({ name, label, error, type, icon, onBlur, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {icon && <i className={`fa ${icon} me-2 text-primary`}></i>}
        {label}
      </label>

      {icon ? (
        <div className="input-group">
          <span className="input-group-text bg-light">
            <i className={`fa ${icon} text-muted`}></i>
          </span>
          <input
            {...rest}
            onBlur={onBlur}
            type={type}
            name={name}
            id={name}
            className={`form-control ${error ? "is-invalid" : ""}`}
            style={{
              borderRadius: "0 8px 8px 0",
              padding: "10px 15px",
            }}
          />
          {error && (
            <div className="invalid-feedback d-block">
              <i className="fa fa-exclamation-circle me-1"></i>
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          <input
            {...rest}
            onBlur={onBlur}
            type={type}
            name={name}
            id={name}
            className={`form-control ${error ? "is-invalid" : ""}`}
            style={{
              borderRadius: "8px",
              padding: "10px 15px",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
          />
          {error && (
            <div className="invalid-feedback d-block">
              <i className="fa fa-exclamation-circle me-1"></i>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Input;
