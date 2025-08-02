import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from './Graficasbases/GraficasBaseSitios';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface SitioEstadistica {
  estado: string;
  cantidad: number;
}

const VistaEstadisticasSitios: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<SitioEstadistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de permisos
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/VistaEstadisticasSitios&idRol=${rolId}`;
        const response = await axios.get(url, { withCredentials: true });
        const permisosData = response.data.data;

        if (permisosData) {
          setPermisos({
            puedeVer: Boolean(permisosData.puedeVer),
            puedeCrear: Boolean(permisosData.puedeCrear),
            puedeEditar: Boolean(permisosData.puedeEditar),
            puedeEliminar: Boolean(permisosData.puedeEliminar),
          });
        } else {
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
        }
      } catch (err) {
        console.error('Error al obtener permisos:', err);
        setPermisos({
          puedeVer: false,
          puedeCrear: false,
          puedeEditar: false,
          puedeEliminar: false,
        });
      }
    };

    fetchPermisos();
  }, []);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (!permisos.puedeVer) return;

      setLoading(true);
      setError(null);

      try {
        const config = { withCredentials: true };
        const url = 'http://localhost:3000/sitio/estadisticas/por-estado';
        const response = await axios.get<SitioEstadistica[]>(url, config);
        setEstadisticas(response.data);
      } catch (err) {
        setError('Error al obtener estadísticas de sitios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [permisos.puedeVer]);

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  const labels = estadisticas.map((e) => e.estado);
  const values = estadisticas.map((e) => e.cantidad);
  const colores = labels.map((estado) =>
    estado === 'ACTIVO' ? '#4ADE80' : '#F87171'
  );

  const total = values.reduce((acc, val) => acc + val, 0);
  const porcentajes = values.map((valor) =>
    total > 0 ? Number(((valor / total) * 100).toFixed(2)) : 0
  );

  const dataBarSitios = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Sitios',
        data: values,
        backgroundColor: colores,
      },
    ],
  };

  const dataPieSitios = {
    labels: labels.map((label, index) => `${label} (${porcentajes[index]}%)`),
    datasets: [
      {
        data: values,
        backgroundColor: colores,
      },
    ],
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Estadísticas de Sitios
        </h1>

        {loading && <p className="text-white text-center">Cargando estadísticas...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">
                Sitios Activos vs Inactivos
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Comparación de sitios activos e inactivos
              </p>
              <div className="max-w-2xl mx-auto">
                <BarChart data={dataBarSitios} />
              </div>
            </Card>

            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">
                Distribución de Sitios (%)
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Porcentaje de sitios activos e inactivos
              </p>
              <div className="max-w-md mx-auto">
                <PieChart data={dataPieSitios} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasSitios;
