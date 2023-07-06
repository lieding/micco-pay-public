import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { setTip } from "../../store/ordering";
import type { TipType } from "../../store/ordering";
import cls from "classnames";

export type TippingCbk = (num: number) => void;

function getActiveType(selected: boolean, isActive: boolean) {
  if (!selected || isActive) return "";
  return styles.inactive;
}

function Tipping(props: { num: number; cbk: TippingCbk; classname: string }) {
  const { num, cbk, classname } = props;
  return (
    <div className={cls(styles.item, classname)} onClick={() => cbk(num)}>
      +{num}€
    </div>
  );
}

function TippingList(props: { tip: TipType }) {
  const { selected, customized, amount } = props.tip;
  const dispatch = useDispatch();
  const inputValRef = useRef(0);
  const cbk = useCallback(
    (num: number | Partial<TipType>) => dispatch(setTip(num)),
    [dispatch]
  );
  const inputCbk = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(event.target.value) || 0;
    inputValRef.current = amount;
    cbk({ amount, customized: true, selected: true });
  };
  const customizedClickHandler = (_: React.MouseEvent<HTMLDivElement>) => {
    const _selected = customized ? !selected : true;
    cbk({ customized: true, selected: _selected, amount: inputValRef.current });
  };

  return (
    <div className={styles.tipping}>
      {tippings.map((e) => (
        <Tipping
          key={e}
          num={e}
          cbk={cbk}
          classname={getActiveType(selected, !customized && amount === e)}
        />
      ))}
      <div
        className={cls(styles.item, getActiveType(selected, customized))}
        onClick={customizedClickHandler}
      >
        <input type="number" onChange={inputCbk} />€
      </div>
    </div>
  );
}

const tippings = [1, 2, 5, 10];

export default TippingList;
