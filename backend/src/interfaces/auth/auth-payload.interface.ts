interface IAuthPayload {
  userId: string;
  role: "user" | "admin" | "hospital";
  iat?: number;
  exp?: number;
}

export default IAuthPayload;