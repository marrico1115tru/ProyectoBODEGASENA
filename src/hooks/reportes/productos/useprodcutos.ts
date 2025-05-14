import { useState, useEffect } from 'react';
import axios from 'axios';

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const { data } = await axios.get("/api/productos");
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productos, loading, refetch: fetchProductos };

  
};
export default useProductos;