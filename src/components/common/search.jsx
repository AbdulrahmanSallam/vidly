const SearchBox = ({ value, onChange }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      type="text"
      placeholder="Search..."
      className="form-control mb-3"
    />
  );
};

export default SearchBox;
