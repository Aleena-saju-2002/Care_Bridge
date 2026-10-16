import api from "./api";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  dob: string;
}

export const signup = async (data: SignupData) => {
  const response = await api.post("/users/signup", data);

  return response.data;
};
