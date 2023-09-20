import { useSelector } from "react-redux";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import { MENU_FEATURE_KEY } from "../../store/menu";
import { ORDERING_FEATURE_KEY } from "../../store/ordering";
import type { RootState } from "../../store";
import { useGetRestInfoQuery, useQueryMenuInfoQuery } from "../../store/api";
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

function selector (state: RootState) {
  return {
    restInfo: state[RESTAURANT_FEATURE_KEY],
    menuInfo: state[MENU_FEATURE_KEY],
    orderInfo: state[ORDERING_FEATURE_KEY],
  }
}

function IndexPage() {
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

  if (!restInfo) return null;
  const items = searchMode ? labelSearchMenus : menuMap[activeCategoryId] ?? [];
  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      <div className={cls("expanded1")}>
        <TableAndDateInfo restInfo={restInfo} table={table} />
        <div className={cls(styles.sectionTitle, styles.buffetTitle)}>
          Nos formules Buffet
        </div>
        <FastBtnBar isCheckout={true} elements={fastCheckouts} />
        <div className={cls(styles.sectionTitle, styles.drinkTitle)}>
          Nos boissons
        </div>
        {/* <SearchComp restaurantId={restaurantId} activeKw={activeKw} /> */}
        <Categories.Tabs
          hideCategory={searchMode}
          categories={categories}
          activeKey={activeCategoryId}
        >
          <CourseMenu items={items} summary={summary} key={activeCategoryId} />
        </Categories.Tabs>
      </div>
      <FloatingBar cbk={toOrder} />
    </div>
  );
}

export default IndexPage;
