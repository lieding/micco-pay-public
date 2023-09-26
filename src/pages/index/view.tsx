import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useGetRestInfoQuery, useQueryMenuInfoQuery } from '../../store';
import FastBtnBar from "../../components/fastBtnBar";
import Categories from "./categories";
import FloatingBar from "../../components/floatingBar";
import CourseMenu from "./courseMenu";
import LogoHeader from "../../components/logoHeader";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { TableAndDateInfo } from '../../components';
import SearchComp from './search';
import styles from "./index.module.scss";
import cls from 'classnames';
import { DisplayMode } from "../../typing";

function selector (state: RootState) {
  return {
    restInfo: state.restaurant,
    menuInfo: state.menu,
    orderInfo: state.ordering,
    configInfo: state.config,
  }
}

function useIndexPageHook () {
  const {
    restInfo: { restInfo, restaurantId, table },
    menuInfo: {
      activeCategoryId,
      fastCheckouts,
      categories,
      menuMap,
      activeKw,
      searchMode,
      labelSearchMenus,
    },
    configInfo: { displayMode },
    orderInfo: { summary },
  } = useSelector(selector);

  const navigate = useNavigate();

  const toOrder = useCallback(() => navigate("/order"), [navigate]);

  useGetRestInfoQuery(restaurantId);

  const skipQueryMenuInfo =
    !restaurantId || !activeCategoryId || !!menuMap[activeCategoryId];

  useQueryMenuInfoQuery(
    {
      restaurantId,
      categoryId: activeCategoryId,
      menuMap,
    },
    { skip: skipQueryMenuInfo }
  );

  const items = searchMode ? labelSearchMenus : menuMap[activeCategoryId] ?? [];

  return {
    restInfo,
    table,
    items,
    toOrder,
    fastCheckouts,
    searchMode,
    categories,
    activeCategoryId,
    summary,
    displayMode,
  };
}

type Params4DisplayType = ReturnType<typeof useIndexPageHook>;

function DisplayInDefaultMarketMode (props: Params4DisplayType) {
  return <div className="page-wrapper">
    <LogoHeader hideBackArrow={true} hideLogo={true} />
    <div className={cls("expanded1")}>
      <TableAndDateInfo restInfo={props.restInfo} />
      <div className={cls(styles.sectionTitle, styles.drinkTitle)}>
        Nos Articles
      </div>
      <Categories.Tabs
        hideCategory={props.searchMode}
        categories={props.categories}
        activeKey={props.activeCategoryId}
      >
        <CourseMenu items={props.items} summary={props.summary} key={props.activeCategoryId} />
      </Categories.Tabs>
    </div>
    <FloatingBar cbk={props.toOrder} />
  </div>
}

function IndexPage() {
  const params = useIndexPageHook();
  
  if (!params.restInfo) return null;

  if (params.displayMode === DisplayMode.DEFAULT_MARKET)
    return <DisplayInDefaultMarketMode {...params} />;
  
  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      <div className={cls("expanded1")}>
        <TableAndDateInfo restInfo={params.restInfo} table={params.table} />
        <div className={cls(styles.sectionTitle, styles.buffetTitle)}>
          Nos formules Buffet
        </div>
        <FastBtnBar isCheckout={true} elements={params.fastCheckouts} />
        <div className={cls(styles.sectionTitle, styles.drinkTitle)}>
          Nos boissons
        </div>
        <Categories.Tabs
          hideCategory={params.searchMode}
          categories={params.categories}
          activeKey={params.activeCategoryId}
        >
          <CourseMenu items={params.items} summary={params.summary} key={params.activeCategoryId} />
        </Categories.Tabs>
      </div>
      <FloatingBar cbk={params.toOrder} />
    </div>
  );
}

export default IndexPage;
