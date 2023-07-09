import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setRestInfo } from "./restaurant";
import { setCatesAndCheckouts, setMenuInfo } from "./menu";
import { isValidQueryRestInfoRes, isValidQueryMenuInfoRes } from "../typing";
import { setStripeInfo } from "./stripe";
import { isValidObject } from "../utils";
import { BASE_URL } from "../consts";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    // when the current category changes, the query of the new menu of the cqtegory follows
    queryMenuInfo: builder.query({
      query: ({ restaurantId, categoryId }) =>
        `/miccoapp-getRestData?restaurantId=${restaurantId}&categoryId=${categoryId}`,
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
      query: (id) => `/miccoapp-getRestData?restaurantId=${id}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (isValidQueryRestInfoRes(data)) {
            const { restInfo, menuInfo, fastCheckouts } = data;
            dispatch(setRestInfo(restInfo));
            dispatch(
              setCatesAndCheckouts({
                fastCheckouts,
                categories: restInfo?.categories,
                menuInfo,
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),
    // get the stripe initialization information
    getStripeInfo: builder.query({
      query: (amount) => `/getPaymentInfo?amount=${amount}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (isValidObject(data)) {
            dispatch(setStripeInfo(data));
          }
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
  useGetStripeInfoQuery,
} = api;
