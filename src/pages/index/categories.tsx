import { setActiveCategory } from "../../store/menu";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { useCallback } from "react";
import cls from "classnames";

const CategoryNameMap: Record<string, string> = {
  MENU: "Menu",
  ENTRY: "Entrée",
  BUSKET: "Buckets",
  SUSHI: "Sushi",
  SOFT: "Boissons",
  BIERE: "Bière",
  ASIAN_STREET_FOOD: "Asian Street Food",
};

export default function Categories(props: {
  categories: string[];
  activeKey: string;
}) {
  const dispatch = useDispatch();
  const cbk = useCallback(
    (catId: string) => dispatch(setActiveCategory(catId)),
    [dispatch]
  );
  return (
    <div className={styles.categories}>
      {props.categories.map((e) => (
        <div
          className={cls(styles.item, {
            [styles.active]: e === props.activeKey,
          })}
          key={e}
          onClick={() => cbk(e)}
        >
          {CategoryNameMap[e.toUpperCase()] ?? ""}
        </div>
      ))}
    </div>
  );
}
