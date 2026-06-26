import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosInstance from "../api/axiosInstance";
import type { AxiosRequestConfig, AxiosError } from "axios";

export const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
  },
  unknown,
  unknown
> =>
  async ({ url, method, body, params }) => {
    try {
      const result = await axiosInstance({ url, method, data: body, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
