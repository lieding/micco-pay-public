import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setRestInfo } from "./restaurant";
import { setCatesAndCheckouts } from "./menu";
import { isValidQueryRestInfoRes } from "../typing";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lx9l9yqrh6.execute-api.eu-west-3.amazonaws.com/default",
  }),
  endpoints: (builder) => ({
    // 定义查询
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
  }),
});

export const { useGetRestInfoQuery } = api;
