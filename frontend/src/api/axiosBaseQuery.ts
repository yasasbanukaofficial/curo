import apiClient from "./axiosClient";

const axiosBaseQuery =
  () =>
  async ({ url, method, body, params }: { url: string; method: string; body?: any; params?: Record<string, any> }) => {
    try {
      const result = await apiClient({ url, method, data: body, params });
      return { data: result.data.data };
    } catch (err: any) {
      return {
        error: {
          status: err.response?.status ?? 500,
          data: err.response?.data ?? { msg: "Network error" },
        },
      };
    }
  };

export default axiosBaseQuery;
