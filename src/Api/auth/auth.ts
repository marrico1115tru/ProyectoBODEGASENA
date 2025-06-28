import axios from 'axios';

interface LoginResponse {
  message: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

interface LogoutResponse {
  message: string;
}

// 🔐 Login: recibe la cookie del token automáticamente
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(
    'http://localhost:3000/auth/login',
    { email, password },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// 🚪 Logout: elimina la cookie httpOnly desde el backend
export const logout = async (): Promise<LogoutResponse> => {
  const response = await axios.post(
    'http://localhost:3000/auth/logout',
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// 👤 Obtener el usuario autenticado desde el token en cookie
export const getProfile = async () => {
  const response = await axios.get('http://localhost:3000/auth/me', {
    withCredentials: true,
  });
  return response.data;
};
