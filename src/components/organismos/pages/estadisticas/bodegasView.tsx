import React, { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'
import { fetchCategorias } from '@/Api/estadisticascategorias'
import { Separator } from '@/components/ui/separator'

const COLORS = ['#6366f1', '#10b981', '#f97316', '#e11d48', '#14b8a6', '#8b5cf6']

export default function CategoriasView() {
  const [categorias, setCategorias] = useState([])
  const [filtroNombre, setFiltroNombre] = useState('Todas')

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

  const nombresUnicos = Array.from(new Set(categorias.map(c => c.nombre)))
  const opcionesFiltro = ['Todas', ...nombresUnicos]

  const categoriasFiltradas = categorias.filter(c =>
    filtroNombre === 'Todas' || c.nombre === filtroNombre
  )

  const resumenNombre = categoriasFiltradas.reduce((acc, cat) => {
    acc[cat.nombre] = (acc[cat.nombre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dataCategorias = Object.entries(resumenNombre).map(([name, value]) => ({ name, value }))
  const total = categoriasFiltradas.length
  const totalNombres = Object.keys(resumenNombre).length

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-16 bg-gray-50 rounded-xl shadow-inner">
      <h1 className="text-4xl font-bold text-gray-800 text-center">Estadísticas de Categorías</h1>

      {/* Filtros */}
      <div className="flex justify-center mb-6">
        <select
          className="p-2 rounded border border-gray-300"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        >
          {opcionesFiltro.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
        <motion.div className="bg-indigo-100 p-6 rounded-xl shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-gray-600">Total Filtradas</p>
          <p className="text-3xl font-bold text-indigo-700">{total}</p>
        </motion.div>
        <motion.div className="bg-teal-100 p-6 rounded-xl shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm text-gray-600">Nombres Únicos</p>
          <p className="text-3xl font-bold text-teal-700">{totalNombres}</p>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div className="bg-white p-6 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Distribución por Nombre</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataCategorias} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {dataCategorias.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Categorías por Nombre</h2>
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
      </div>

      {/* Tabla de detalles */}
      <motion.div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
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
            {categoriasFiltradas.map((cat) => (
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
