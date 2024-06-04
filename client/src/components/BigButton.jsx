const BigButton = (props) => {
  return (
    <a href={props.link}>
      <button
        disabled={props.disabled}
        onClick={props.onClick}
        className={
          props.className === "remove" ? "big-button remove" : "big-button"
        }
      >
        {props.text}
      </button>
    </a>
  );
};

export default BigButton;
