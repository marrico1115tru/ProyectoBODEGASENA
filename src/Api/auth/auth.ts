import axiosInstance from "./../axios"; 

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const recuperarPassword = async (email: string): Promise<void> => {
  await axiosInstance.post("/auth/recuperar", { email });
};
