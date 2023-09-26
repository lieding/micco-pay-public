import { isValidObject } from "../../utils";

const SearchAddressUrl = 'https://api-adresse.data.gouv.fr/search/';

/// city: "Paris"
// citycode: "75118"
// context: "75, Paris, Île-de-France"
// district: "Paris 18e Arrondissement" Attention, this value maybe Null
/// housenumber "113" Attention, this value maybe Null
// id: "75118_5122"
// importance: 0.74667
// label: "Avenue Junot 75018 Paris"
// name: "Avenue Junot"
// postcode: "75018"
// score: 0.2724245454545455
// street: "Avenue Junot"
// type: "street"  OR "housenumber"
// x: 651328.83
// y: 6865553.21
export interface LocationResOption {
  id: string
  city: string
  citycode: string
  context: string
  district?: string
  housenumber?: string
  postcode: string
  street: string
  label: string
  type: "street" | "housenumber" | "municipality"
}

export function queryLocation (kw: string) {
  return fetch(`${SearchAddressUrl}?q=${kw}&limit=6`)
    .then(res => res.json())
    .then(res => res.features?.map((ele: any) => ele?.properties))
    .then((items: LocationResOption[]) => items.filter(isValidObject));
}