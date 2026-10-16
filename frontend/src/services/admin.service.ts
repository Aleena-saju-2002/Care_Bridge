import axios from "axios";


const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "hospital";
  isBlocked: boolean;
  isVerified: boolean;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAdminUsers = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<UsersResponse> => {
  const response = await adminApi.get<UsersResponse>(
    "/admin/users",
    {
      params: { page, limit, search },
    }
  );

  return response.data;
};

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean
) => {
  const response = await adminApi.patch(
    `/admin/users/${userId}/block`,
    { isBlocked }
  );

  return response.data;
};