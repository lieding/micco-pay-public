import { BASE_URL } from "../../consts";
import { Contact, PgPaymentMethod } from "../../typing";

// get the stripe initialization information
export function queryPgOrderInfo (
  restaurantId: string,
  amount: number,
  rounded: boolean,
  contact: Contact,
  platforms: undefined | PgPaymentMethod[]
) {
  const url = BASE_URL + `/getPaymentInfo?restaurantId=${restaurantId}`;
  const body = JSON.stringify({ amount, rounded, contact, platforms });
  return fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json());
}