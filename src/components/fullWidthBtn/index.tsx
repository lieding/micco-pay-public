import styles from './index.module.scss';
import cls from 'classnames';

function FullWidthBtn ({ children, cbk, disabled, ...props }: {
  children: React.ReactElement,
  cbk: () => void,
  disabled?: boolean
}) {
  return <div
    className={cls(styles.fullWidthBtn, disabled ? styles.disabled : null)}
    onClick={disabled ? undefined : cbk}
    {...props}
  >
    { children }
  </div>
}

export default FullWidthBtn