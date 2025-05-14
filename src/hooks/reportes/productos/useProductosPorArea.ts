import { useState, useEffect } from 'react';
import axios from 'axios';


const useProductosPorArea = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get("/api/productos/estadisticas/por-area");
      setData(res.data);
    } catch (err) {
      console.error("Error al obtener productos por área", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, refetch: fetch };
};
export default useProductosPorArea;