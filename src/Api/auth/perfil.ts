import axiosInstance from './../axios'; 

export const getPerfil = async () => {
  try {
    const response = await axiosInstance.get('/usuarios/perfil');
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error;
  }
};