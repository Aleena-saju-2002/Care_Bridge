import IResponse from "../interfaces/common/response.interface";

export const successResponse = <T>(
  message: string,
  data?: T
): IResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string): IResponse => {
  return {
    success: false,
    message,
  };
}; 

