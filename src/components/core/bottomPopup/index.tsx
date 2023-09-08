import { createPortal } from "react-dom";
import styles from './index.module.scss';
import cls from 'classnames';
import { CloseIcon } from '../../icons'

interface IBottomPopup {
  children: React.ReactElement,
  visible: boolean
  toggleClose: () => void
  height?: string
  customClass?: string
}

function BottomPopup ({
  children,
  visible,
  toggleClose,
  height,
  customClass,
}: IBottomPopup) {
  return createPortal(
    <>
      {visible && <div className="curtain"></div>}
      <div
        className={cls(styles.wrapper, visible ? styles.visible : null, customClass)}
        style={{ height }}
      >
        <div className={styles.close}>
          <CloseIcon onClick={toggleClose} />
        </div>
        { children }
      </div>
    </>,
    document.body
  );
}

export default BottomPopup;