import cls from "classnames";
import styles from "./index.module.scss";
import { ChevronBackIcon } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

function LogoHeader(props: {
  hideBackArrow?: boolean;
  backArrowCbk?: () => void;
}) {
  const navigate = useNavigate();
  const back = useCallback(() => navigate(-1), [navigate]);
  return (
    <div className={cls(styles.logoWrapper, "textAlign")}>
      <img src="micco-pay-logo.png" />
      {props.hideBackArrow ?? false ? null : (
        <ChevronBackIcon className={styles.backArrow} onClick={back} />
      )}
    </div>
  );
}

export default LogoHeader;
