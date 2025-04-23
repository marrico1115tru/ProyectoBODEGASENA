import React, { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'
import { fetchCategorias } from '@/Api/estadisticascategorias'
import { Separator } from '@/components/ui/separator'

const COLORS = ['#6366f1', '#10b981', '#f97316', '#e11d48', '#14b8a6', '#8b5cf6']

export default function EstadisticasCategoriasAvanzadas() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await fetchCategorias()
        setCategorias(data)
      } catch (err) {
        console.error('Error al obtener categorías', err)
      }
    }
    cargarDatos()
  }, [])

  const resumen = categorias.reduce((acc, cat) => {
    acc[cat.nombre] = (acc[cat.nombre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dataCategorias = Object.entries(resumen).map(([name, value]) => ({ name, value }))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 bg-gray-50 rounded-xl shadow-inner">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Panel de Decisiones - Categorías</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Pie Chart - Proporción */}
        <motion.div className="bg-white p-6 rounded-xl shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-center mb-4">Proporción de Categorías</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataCategorias} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {dataCategorias.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Comparación directa */}
        <motion.div className="bg-white p-6 rounded-xl shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-center mb-4">Cantidad por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataCategorias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Area Chart - Tendencias acumulativas */}
        <motion.div className="bg-white p-6 rounded-xl shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-center mb-4">Acumulado por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataCategorias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="#99f6e4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart - Comparación multidimensional */}
        <motion.div className="bg-white p-6 rounded-xl shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-center mb-4">Radar de Categorías</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={100} data={dataCategorias}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Categorías" dataKey="value" stroke="#e11d48" fill="#fecdd3" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla resumen */}
      <motion.div className="bg-white p-6 rounded-xl shadow overflow-x-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">Detalle de Categorías</h2>
        <Separator className="mb-4" />
        <table className="min-w-full table-auto border border-gray-200 rounded-xl">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold text-left">Nombre</th>
              <th className="px-4 py-2 text-sm font-semibold text-left">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-2">{cat.nombre}</td>
                <td className="px-4 py-2">{cat.descripcion || 'Sin descripción'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
