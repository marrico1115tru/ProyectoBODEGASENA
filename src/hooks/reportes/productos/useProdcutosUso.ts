import { useState, useEffect } from 'react';
import axios from 'axios';

 const useProductosUso = () => {
  const [masUsados, setMasUsados] = useState([]);
  const [menosUsados, setMenosUsados] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get("/api/productos/estadisticas/uso");
      setMasUsados(res.data.mas);
      setMenosUsados(res.data.menos);
    } catch (err) {
      console.error("Error al obtener productos usados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { masUsados, menosUsados, loading, refetch: fetch };
};
export default useProductosUso;