import IntroBg from "./introBg";
import { useSelector } from "react-redux";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import { MENU_FEATURE_KEY } from "../../store/menu";
import { ORDERING_FEATURE_KEY } from "../../store/ordering";
import type { RootState } from "../../store";
import { useGetRestInfoQuery } from "../../store/api";
import FastBtnBar from "../../components/fastBtnBar";
import Categories from "./categories";
import FloatingBar from "../../components/floatingBar";
import CourseMenu from "./courseMenu";
import TimeAndTableInfo from "../../components/DatetimeTableBar";
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
  
  const toOrder = useCallback(() => navigate('/order'), [navigate]);

  useGetRestInfoQuery(restaurantId);

  if (!restInfo) return null;
  return (
    <div className="page-wrapper">
      <div className="logo-wrapper textAlign">
        <img src="micco-pay-logo.png" />
      </div>
      <IntroBg restInfo={restInfo} />
      <TimeAndTableInfo table={table} />
      <FastBtnBar isCheckout={true} elements={fastCheckouts} />
      <Categories categories={categories} activeKey={activeCategoryId} />
      <CourseMenu items={menuMap[activeCategoryId] ?? []} summary={summary} />
      <FloatingBar cbk={toOrder} />
    </div>
  );
}

export default IndexPage;
