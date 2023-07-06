import { useCallback } from "react";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { setTip } from "../../store/ordering";

export type TippingCbk = (num: number) => void;

function Tipping(props: { num: number; cbk: TippingCbk }) {
  const { num, cbk } = props;
  return (
    <div className={styles.item} onClick={() => cbk(num)}>
      +{num}€
    </div>
  );
}

function TippingList() {
  const dispatch = useDispatch();
  const cbk = useCallback((num: number) => dispatch(setTip(num)), [dispatch]);
  const inputCbk = (event: React.ChangeEvent<HTMLInputElement>) =>
    cbk(Number(event.target.value) || 0);

  return (
    <div className={styles.tipping}>
      {tippings.map((e) => (
        <Tipping key={e} num={e} cbk={cbk} />
      ))}
      <div className={styles.item}>
        <input type="number" onChange={inputCbk} />€
      </div>
    </div>
  );
}

const tippings = [1, 2, 5, 10];

export default TippingList;
