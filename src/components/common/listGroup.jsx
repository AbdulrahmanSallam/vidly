import { motion } from "framer-motion";

const ListGroup = ({
  items,
  selectedItem,
  textProperty = "name",
  valueProperty = "_id",
  onItemSelected,
}) => {
  return (
    <div className="space-y-1">
      {items.map(item => {
        const isSelected = selectedItem === item;
        return (
          <motion.button
            key={item[valueProperty]}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onItemSelected(item)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
            {item[valueProperty] ? (
              <i
                className={`fa fa-circle text-[8px] mr-2 ${isSelected ? "text-white" : "text-blue-400"}`}></i>
            ) : (
              <i className="fa fa-list mr-2"></i>
            )}
            {item[textProperty]}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ListGroup;
