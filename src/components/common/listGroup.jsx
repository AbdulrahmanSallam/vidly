const ListGroup = props => {
  const {
    items,
    selectedItem,
    textProperty = "name",
    valueProperty = "_id",
    onItemSelected,
  } = props;

  return (
    <div className="list-group">
      {items.map(item => (
        <a
          key={item[valueProperty]}
          onClick={() => onItemSelected(item)}
          className={
            selectedItem === item
              ? "list-group-item list-group-item-action active"
              : "list-group-item list-group-item-action"
          }
          aria-current={selectedItem === item ? true : false}>
          {item[textProperty]}
        </a>
      ))}
    </div>
  );
};

export default ListGroup;
