import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setRestInfo, setFeeConfig } from "./restaurant";
import { setCatesAndCheckouts, setMenuInfo, setSearchRes } from "./menu";
import { isValidQueryRestInfoRes, isValidQueryMenuInfoRes } from "../typing";
import { BASE_URL } from "../consts";
import { setPaymentConfigs } from "./ordering";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    // when the current category changes, the query of the new menu of the cqtegory follows
    queryMenuInfo: builder.query({
      query: ({ restaurantId, categoryId }) =>
        `/getRestData?restaurantId=${restaurantId}&categoryId=${categoryId}`,
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        const { categoryId } = query;
        try {
          const { data } = await queryFulfilled;
          if (isValidQueryMenuInfoRes(data)) {
            const { menuInfo = [] } = data;
            dispatch(setMenuInfo({ categoryId, menuInfo }));
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),
    // get the initial restaurat information
    getRestInfo: builder.query({
      query: (id) => `/getRestData?restaurantId=${id}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (isValidQueryRestInfoRes(data)) {
            const { restInfo, menuInfo, fastCheckouts, holiday, feeConfig } =
              data;
            dispatch(setRestInfo(restInfo));
            dispatch(
              setCatesAndCheckouts({
                fastCheckouts,
                categories: restInfo?.categories,
                menuInfo,
                holiday,
              })
            );
            dispatch(
              setFeeConfig({
                percentage: Number(feeConfig?.percentage) || 0,
                addition: Number(feeConfig?.addition) || 0,
              })
            );
            dispatch(setPaymentConfigs(restInfo?.paymentMethods));
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),
    // search menus by label name
    queryMebuByLabel: builder.query({
      query: ({ restaurantId, keyword }) => `/search-by-label?restaurantId=${restaurantId}&keyword=${keyword}`,
      async onQueryStarted({ keyword }: { keyword: string }, { dispatch, queryFulfilled }) {
        try {
          const { data: labelSearchMenus } = await queryFulfilled;
          dispatch(setSearchRes({ keyword, labelSearchMenus }));
        } catch (err) {
          console.error(err);
        }
      },
    }),
  }),
});

export const {
  useGetRestInfoQuery,
  useQueryMenuInfoQuery,
  useQueryMebuByLabelQuery,
} = api;
