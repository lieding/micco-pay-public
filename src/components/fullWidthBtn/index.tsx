import styles from './index.module.scss'

function FullWidthBtn ({ children, cbk, ...props }: {
  children: React.ReactElement,
  cbk: () => void,
}) {
  return <div className={styles.fullWidthBtn} onClick={cbk} {...props}>
    { children }
  </div>
}

export default FullWidthBtn