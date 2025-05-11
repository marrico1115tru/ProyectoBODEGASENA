import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

const colores = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

const VistaSolicitudesEntregas: React.FC = () => {
  const [solicitudesPorMes, setSolicitudesPorMes] = useState([]);
  const [estadoSolicitudes, setEstadoSolicitudes] = useState([]);
  const [tiempoEntrega, setTiempoEntrega] = useState([]);
  const [materialesMasSolicitados, setMaterialesMasSolicitados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mesRes, estadoRes, tiempoRes, materialesRes] = await Promise.all([
          axios.get('http://localhost:3500/api/solicitudes/por-mes'),
          axios.get('http://localhost:3500/api/solicitudes/estado'),
          axios.get('http://localhost:3500/api/solicitudes/tiempo-entrega'),
          axios.get('http://localhost:3500/api/solicitudes/materiales-mas-solicitados'),
        ]);
        setSolicitudesPorMes(mesRes.data);
        setEstadoSolicitudes(estadoRes.data);
        setTiempoEntrega(tiempoRes.data);
        setMaterialesMasSolicitados(materialesRes.data);
      } catch (error) {
        console.error("Error al cargar las estadísticas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Solicitudes por Mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={solicitudesPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cantidad" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Pendientes vs Completadas</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoSolicitudes}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {estadoSolicitudes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Tiempo Promedio de Entrega (días)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tiempoEntrega}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dias" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Materiales Más Solicitados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={materialesMasSolicitados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default VistaSolicitudesEntregas;
