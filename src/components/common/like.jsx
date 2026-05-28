const Like = props => {
  const { liked, onClick } = props;

  let classes = "fa-heart fa";
  if (liked) classes += "s";
  else classes += "r";
  return <i role="button" className={classes} onClick={onClick}></i>;
};

export default Like;
