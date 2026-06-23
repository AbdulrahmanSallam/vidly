import _ from "lodash";

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
  const pageCount = Math.ceil(itemsCount / pageSize);
  if (pageCount <= 1) return null;

  const pages = _.range(1, pageCount + 1);

  return (
    <div className="flex justify-center">
      <nav className="flex gap-1">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200
              ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
