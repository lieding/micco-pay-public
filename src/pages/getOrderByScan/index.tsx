import { useSearchParams } from "react-router-dom";
import LogoHeader from "../../components/logoHeader";
import { useState, useEffect } from "react";
import Table from "./table";
import { getOrder } from "./helper";
import { ScanOrderResponse } from "../../typing";

function GetOrderByScan() {
  const [orderInfo, setOrderInfo] = useState<ScanOrderResponse | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const restaurantId = searchParams.get("restaurantId");
    if (!id || !restaurantId) {
      console.error("couldn't get id or restaurantId from searchParams");
      return;
    }
    getOrder(id, restaurantId).then(setOrderInfo).catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      {orderInfo && <Table data={orderInfo} />}
    </div>
  );
}

export default GetOrderByScan;
