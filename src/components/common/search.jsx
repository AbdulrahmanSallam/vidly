const SearchBox = ({ value, onChange }) => {
  return (
    <div className="relative">
      <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Search customers..."
        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
      />
    </div>
  );
};

export default SearchBox;
