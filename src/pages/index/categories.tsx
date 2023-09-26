import { setActiveCategory } from "../../store/menu";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { useCallback, useMemo } from "react";
import cls from "classnames";
import { Tabs, ConfigProvider } from "react-vant";

const CategoryNameMap: Record<string, string> = {
  MENU: "Menu",
  ENTRY: "Entrée",
  BUSKET: "Bucket",
  SUSHI: "Sushi",
  SOFT: "Soda",
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
  BOISSONCHAUDE: "Boisson chaude",
  NOUILLE: "Nouille",
  CONSERVE: "Conserve",
  HUILE: "Huile",
  LEGUME: "Légume",
  ASSAISONNEMENT: "Assaisonnement",
  BOISSON: "Boisson"
};

interface ICategory {
  categories: string[];
  activeKey: string;
  hideCategory?: boolean
}

function useCategoryHook (categories: string[]) {
  const dispatch = useDispatch();
  const cbk = useCallback(
    (catId: string) => dispatch(setActiveCategory(catId)),
    [dispatch]
  );
  const tabPaneClickHandler = useCallback((_: any, index: number) =>
    cbk(categories[index]), [categories]);
  const categoryArr = useMemo(
    () =>
      categories
        .map((key) => ({ key, txt: CategoryNameMap[key.toUpperCase()] }))
        .filter((item) => Boolean(item.txt)),
    [categories]
  );

  return { cbk, categoryArr, tabPaneClickHandler };
}

function Categories({ categories, activeKey, }: ICategory) {
  const { cbk, categoryArr } = useCategoryHook(categories);

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

const ThemeVars = {
  tabTextColor: '#828282',
  tabActiveTextColor: '#fff',
  tabCapsulePadding: '0',
  tabsNavBackgroundColor: 'transparent',
  tabsBottomBarColor: 'transparent',
}

function CategoryTabs ({
  categories,
  activeKey,
  children,
  hideCategory,
}: ICategory & { children: React.ReactElement }) {
  const { tabPaneClickHandler, categoryArr } = useCategoryHook(categories);

  return <ConfigProvider themeVars={ThemeVars}>
    <Tabs
      swipeable
      type="capsule"
      className={cls(styles.categoryTabs, hideCategory ? styles.hidden : null)}
      onChange={tabPaneClickHandler}
    >
      {categoryArr.map((item) => (
        <Tabs.TabPane key={item.key} title={item.txt}>
          { item.key === activeKey ? children : null }
        </Tabs.TabPane>
      ))}
    </Tabs>
  </ConfigProvider>
}

Categories.Tabs = CategoryTabs;

export default Categories;
