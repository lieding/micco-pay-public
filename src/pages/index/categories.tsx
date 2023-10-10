import { setActiveCategory } from "../../store/menu";
import { useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { useCallback, useEffect, useMemo } from "react";
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
  BOISSON: "Boisson",
  PY_ZWFC: "中午饭菜",
  PY_HFWM: "盒饭外卖",
  PY_DXTM: "点心汤面",
  PY_MZLW: "秘制卤味",
  PY_ZCTS: "主厨特色",
  PY_HXPP: "海鲜拼盘"
};

interface ICategory {
  categories: string[];
  activeKey: string;
  hideCategory?: boolean
}

function useCategoryHook (categories: string[], initActiveKey?: string) {
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
  const defaultActiveIdx = initActiveKey ? categories.indexOf(initActiveKey) : 0;

  return { cbk, categoryArr, tabPaneClickHandler, defaultActiveIdx };
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
  const {
    tabPaneClickHandler,
    categoryArr,
    defaultActiveIdx
  } = useCategoryHook(categories, activeKey);

  return <ConfigProvider themeVars={ThemeVars}>
    <Tabs
      swipeable
      type="capsule"
      defaultActive={defaultActiveIdx}
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
