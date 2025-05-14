import { useState, useEffect } from 'react';
import axios from 'axios';

const useProductosProximosVencer = (dias = 30) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`/api/productos/estadisticas/proximos-vencer?dias=${dias}`);
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos próximos a vencer", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [dias]);

  return { productos, loading, refetch: fetch };
};

export default useProductosProximosVencer;