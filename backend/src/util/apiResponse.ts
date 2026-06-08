export interface ErrorResponse {
  success: false;
  status: number;
  msg?: string;
}

export interface SuccessResponse<T> {
  success: true;
  status: number;
  msg?: string;
  data?: T;
}

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export const sendResponse = <T>(res: any, payload: APIResponse<T>) => {
  return res.status(payload.status).json(payload);
};
