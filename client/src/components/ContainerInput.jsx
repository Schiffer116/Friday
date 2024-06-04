const ContainerInput = (props) => {
  props.debug === undefined ? null : console.log(props.debug);
  return (
    <div className="input-cont">
      <label htmlFor={props.htmlFor === undefined ? props.type : props.htmlFor}>
        {props.label}
      </label>
      <input
        className={"input-box"}
        type={props.type}
        id={props.id}
        ref={props.ref}
        autoComplete="off"
        onChange={props.onChange}
        value={props.value}
        required
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        aria-invalid={props.valid ? "false" : "true"}
        aria-describedby={"uidnote"}
      />
      <section>{props.error}</section>
    </div>
  );
};

export default ContainerInput;
