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

export function formatOrderInfo(data: ScanOrderResponse) {
  const config: Array<{ title: string; value: string }> = [];
  for (const key in data) {
    const title = NameMap[key];
    if (title) {
      let value: any = data[key as keyof ScanOrderResponse];
      if (key === "createdAt") {
        value = new Date(value).toLocaleString();
      }
      config.push({ title, value });
    }
  }
  const orders = data.orders;
  if (isValidArray(orders)) {
    for (const item of orders) {
      const itemm = item as { count: number; price: number; name: string };
      const value = `${itemm.count || 1} x ${itemm.price}€`;
      config.push({ title: itemm.name, value });
    }
  }
  return config;
}

const NameMap: Record<string, string> = {
  restaurantId: "L'id du restaurant",
  table: "Table",
  createdAt: "Temps",
  amount: "Montant payé",
  paymentStatus: "Paiement",
};
