import styles from "./index.module.scss";
import { useCallback } from "react";
import cls from 'classnames';

function CustomInput(props: {
  prefix?: React.ReactElement;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    formName?: string
  ) => void;
  placeholder?: string;
  name?: string;
  validities?: Record<string, string>;
  [key: string]: any;
}) {
  const { prefix, onChange, placeholder, name, validities, ...params } = props;
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e, name);
    },
    [onChange]
  );
  const validity = validities?.[name ?? ""];
  return (
    <div className={styles.wrapper}>
      {prefix}
      <input
        onChange={changeHandler}
        placeholder={placeholder}
        id={name}
        {...params}
        className={cls(styles.customInput, params.className)}
      />
      {validity && <span className={styles.validity}>{validity}</span>}
    </div>
  );
}

export default CustomInput;
