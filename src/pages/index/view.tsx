import IntroBg from "./introBg";
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
import TimeAndTableInfo from "../../components/DatetimeTableBar";
import LogoHeader from "../../components/logoHeader";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

function IndexPage() {
  const {
    restInfo: { restInfo, restaurantId, table },
    menuInfo: { activeCategoryId, fastCheckouts, categories, menuMap },
    orderInfo: { summary },
  } = useSelector((state: RootState) => ({
    restInfo: state[RESTAURANT_FEATURE_KEY],
    menuInfo: state[MENU_FEATURE_KEY],
    orderInfo: state[ORDERING_FEATURE_KEY],
  }));

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
  const items = menuMap[activeCategoryId] ?? [];
  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      <div className="expanded1">
        <IntroBg restInfo={restInfo} />
        <TimeAndTableInfo table={table} />
        <FastBtnBar isCheckout={true} elements={fastCheckouts} />
        <Categories categories={categories} activeKey={activeCategoryId} />
        <CourseMenu items={items} summary={summary} />
      </div>
      <FloatingBar cbk={toOrder} />
    </div>
  );
}

export default IndexPage;
