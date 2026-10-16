interface IResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export default IResponse;