import axios from 'axios';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email,
    password,
  }, {
    withCredentials: true,
  });

  return response.data;
};
