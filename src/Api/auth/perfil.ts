import axios from 'axios';
const API_URL = 'http://localhost:3000/usuarios/perfil';


const config = {
  withCredentials: true, 
};


export const getPerfil = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    
    console.error("Error al obtener el perfil del usuario:", error);

    throw error;
  }
};