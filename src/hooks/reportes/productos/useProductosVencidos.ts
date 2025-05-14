import { useState, useEffect } from 'react';
import axios from 'axios';

const useProductosVencidos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get("/api/productos/estadisticas/vencidos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos vencidos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { productos, loading, refetch: fetch };
};

export default useProductosVencidos;