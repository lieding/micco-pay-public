import { setActiveCategory } from "../../store/menu";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { useCallback, useMemo } from "react";
import cls from "classnames";

const CategoryNameMap: Record<string, string> = {
  MENU: "Menu",
  ENTRY: "Entrée",
  BUSKET: "Bucket",
  SUSHI: "Sushi",
  SOFT: "Boisson",
  COCKTAIL: "Cocktail",
  EAU: "Eau",
  APERITIF: "Apéritif",
  VIN: "Vin",
  ROUGE: "Vin Rouge",
  BLANC: "Vin Blanc",
  ROSE: "Vin Rosé",
  CHAMPAGNE: "Champagne",
  DIGESTIF: "Digestif",
  BIERE: "Bière",
  ASIAN_STREET_FOOD: "Asian Street Food",
};

export default function Categories({
  categories,
  activeKey,
}: {
  categories: string[];
  activeKey: string;
}) {
  const dispatch = useDispatch();
  const cbk = useCallback(
    (catId: string) => dispatch(setActiveCategory(catId)),
    [dispatch]
  );
  const categoryArr = useMemo(
    () =>
      categories
        .map((key) => ({ key, txt: CategoryNameMap[key.toUpperCase()] }))
        .filter((item) => Boolean(item.txt)),
    [categories]
  );

  return (
    <div className={styles.categories}>
      <div className={styles.scrollWrapper}>
        {categoryArr.map(({ key, txt }) => (
          <div
            className={cls(styles.item, {
              [styles.active]: key === activeKey,
            })}
            key={key}
            onClick={() => cbk(key)}
          >
            {txt}
          </div>
        ))}
      </div>
    </div>
  );
}
