import { useState, useEffect } from 'react';
import axios from 'axios';

const useHistorialProducto = (productoId: number | string | null) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!productoId) return;
    try {
      const res = await axios.get(`/api/productos/estadisticas/historial/${productoId}`);
      setHistorial(res.data);
    } catch (err) {
      console.error("Error al obtener historial del producto", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [productoId]);

  return { historial, loading, refetch: fetch };
};

export default useHistorialProducto;
