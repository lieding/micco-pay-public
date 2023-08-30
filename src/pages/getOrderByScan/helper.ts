import { BASE_URL } from "../../consts";
import { ScanOrderResponse } from "../../typing";
import { isValidArray } from "../../utils";

export function getOrder(
  id: string,
  restaurantId: string
): Promise<ScanOrderResponse> {
  return fetch(`${BASE_URL}/getOrder?id=${id}&restaurantId=${restaurantId}`, {
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

export function formatOrderInfo(
  data: ScanOrderResponse,
  config?: { excludeTableInfo: boolean | undefined  }
) {
  const ret: Array<{ title: string; value: string }> = [];
  for (const key in data) {
    if (key === 'table' && config?.excludeTableInfo)
      continue;
    const title = NameMap[key];
    if (title) {
      let value: any = data[key as keyof ScanOrderResponse];
      if (key === "createdAt") {
        value = new Date(value).toLocaleString();
      }
      ret.push({ title, value });
    }
  }
  const orders = data.orders;
  if (isValidArray(orders)) {
    for (const item of orders) {
      const itemm = item as { count: number; price: number; name: string };
      const value = `${itemm.count || 1} x ${itemm.price}€`;
      ret.push({ title: itemm.name, value });
    }
  }
  return ret;
}

const NameMap: Record<string, string> = {
  // restaurantId: "L'id du restaurant",
  table: "Table",
  createdAt: "Temps",
  amount: "Montant payé",
  paymentStatus: "Paiement",
};
