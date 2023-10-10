import { useSelector } from "react-redux";
import { RootState, useQueryMenuInfoQuery } from "../../store";
import { TableAndDateInfo, FastBtnBar, FloatingBar, LogoHeader } from "../../components";
import OrderSummary from "./OrderingSummary";
import CourseMenu from '../index/courseMenu';
import styles from "./index.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import {
  ORDERING_FEATURE_KEY,
} from "../../store/ordering";
import { ICourse } from "../../typing";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useScrollTop } from "../../hooks";
import cls from 'classnames'
import { CONFIG_FEATURE_KEY, checkHideMiccopayLogo } from "../../store/config";
import { MENU_FEATURE_KEY } from "../../store/menu";

function selector (state: RootState) {
  const hideLogo =
    checkHideMiccopayLogo(state[CONFIG_FEATURE_KEY].displayMode);
  const { restInfo, restaurantId, table } = state[RESTAURANT_FEATURE_KEY];
  const { cateKey4OrderingFastBar: key4FastBar = '' } = restInfo || {};
  const { menuMap } = state[MENU_FEATURE_KEY];
  return {
    restInfo,
    orderInfo: state[ORDERING_FEATURE_KEY],
    hideLogo,
    key4FastBar,
    menuMap,
    restaurantId,
    table
  };
}

function useOrderingPageHook () {
  const navigate = useNavigate();
  useScrollTop();
  const {
    orderInfo: { summary },
    restInfo,
    restaurantId,
    table,
    hideLogo,
    key4FastBar,
    menuMap
  } = useSelector(selector);
  
  const items4FastBar = menuMap[key4FastBar];

  const skipQueryMenuInfo =
    !restaurantId || !key4FastBar || !!items4FastBar;

  useQueryMenuInfoQuery(
    {
      restaurantId,
      categoryId: key4FastBar,
    },
    { skip: skipQueryMenuInfo }
  );
  
  const toNext = useCallback(() => navigate("/confirm"), [navigate]);

  return {
    toNext,
    hideLogo,
    table,
    summary,
    restInfo,
    key4FastBar,
    items4FastBar
  }
}

function OrderingPage() {
  const {
    toNext,
    hideLogo,
    table,
    summary,
    restInfo,
    key4FastBar,
    items4FastBar,
  } = useOrderingPageHook();
  
  return (
    <div className="page-wrapper">
      <LogoHeader hideLogo={hideLogo} />
      <div className={cls('expanded1', styles.contentWrapper)}>
        <TableAndDateInfo restInfo={restInfo} table={hideLogo ? undefined : table} />
        <OrderSummary summary={summary} />
        <div className={styles.titlePackaging}>A emporter en plus?</div>
        {
          key4FastBar ?
            <CourseMenu summary={summary} items={items4FastBar ?? []} /> :
            <FastBtnBar isCheckout={false} elements={PackagingOptions} />
        }
      </div>
      <FloatingBar cbk={toNext} />
    </div>
  );
}

export default OrderingPage;

const PackagingOptions: Array<ICourse> = [
  {
    label: "Petite barquette",
    key: "barquette-1",
    price: 7,
    category: "",
    restaurantId: "",
    isPack: true,
  },
  {
    label: "Moyenne barquette",
    key: "barquette-2",
    price: 9,
    category: "",
    restaurantId: "",
    isPack: true,
  },
  {
    label: "Grande barquette",
    key: "barquette-3",
    price: 12,
    category: "",
    isPack: true,
    restaurantId: "",
  },
];
