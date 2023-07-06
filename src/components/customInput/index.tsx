import styles from "./index.module.scss";

function CustomInput(props: {
  prefix?: React.ReactElement;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  const { prefix, onChange, placeholder } = props;
  return (
    <div className={styles.wrapper}>
      {prefix}
      <input
        className={styles.customInput}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default CustomInput;
