import { baseApi } from "../../api/baseApi";
import type { Version } from "../../types/version";

export const versionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVersions: builder.query<Version[], string>({
      query: (secretId) => `/version/all/${secretId}`,
      transformResponse: (response: { data: Version[] }) => response.data,
      providesTags: (result, error, secretId) => [{ type: "Version", id: secretId }],
    }),
    addVersion: builder.mutation<Version, { secretId: string; secKey: string }>({
      query: (body) => ({
        url: "/version/save",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Version", id: arg.secretId },
        { type: "Secret", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetVersionsQuery,
  useAddVersionMutation,
} = versionApi;
