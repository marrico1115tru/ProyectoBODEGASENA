import React, { useEffect, useState } from 'react';
import CentrosFormacion from "@/components/organismos/pages/estadisticas/centrosFormacion";
import { fetchCentrosFormacion, CentroFormacion } from "@/Api/centrosFormacion"; // ajusta ruta si es necesario

const CentrosFormacionView: React.FC = () => {
  const [data, setData] = useState<CentroFormacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const centros = await fetchCentrosFormacion();
        setData(centros);
      } catch (error) {
        console.error('Error al cargar centros:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }

  return <CentrosFormacion data={data} />;
};

export default CentrosFormacionView;
