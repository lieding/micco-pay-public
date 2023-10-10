import type { LocationResOption } from "../../typing";
import { isValidObject } from "../../utils";

const SearchAddressUrl = 'https://api-adresse.data.gouv.fr/search/';

export function queryLocation (kw: string) {
  return fetch(`${SearchAddressUrl}?q=${kw}&limit=6`)
    .then(res => res.json())
    .then(res => res.features?.map((ele: any) => ele?.properties))
    .then((items: LocationResOption[]) => items.filter(isValidObject));
}