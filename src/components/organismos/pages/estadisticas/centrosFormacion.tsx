import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

interface CentrosFormacion {
  id: number
  nombre: string
  ubicacion: string
  telefono?: string
  fecha_registro: string
}

interface Props {
  data: CentrosFormacion[]
}

const COLORS = ['#6366f1', '#10b981', '#f97316', '#e11d48', '#14b8a6', '#8b5cf6']

const EstadisticasCentros: React.FC<Props> = ({ data }) => {
  const totalCentros = data.length

  const agrupadoUbicacion = data.reduce((acc: Record<string, number>, centro) => {
    acc[centro.ubicacion] = (acc[centro.ubicacion] || 0) + 1
    return acc
  }, {})
  const datosUbicacion = Object.entries(agrupadoUbicacion).map(([ubicacion, cantidad]) => ({ ubicacion, cantidad }))
  const totalUbicaciones = Object.keys(agrupadoUbicacion).length

  const agrupadoMes = data.reduce((acc: Record<string, number>, centro) => {
    const mes = new Date(centro.fecha_registro).toLocaleString('default', { month: 'short' })
    acc[mes] = (acc[mes] || 0) + 1
    return acc
  }, {})
  const datosMensuales = Object.entries(agrupadoMes).map(([mes, cantidad]) => ({ mes, cantidad }))
  const mesMasActivo = Object.entries(agrupadoMes).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0]

  const datosCrecimiento = datosMensuales.map((d, i, arr) => {
    const anterior = arr[i - 1]?.cantidad || 0
    const crecimiento = anterior ? ((d.cantidad - anterior) / anterior) * 100 : 0
    return { mes: d.mes, crecimiento: parseFloat(crecimiento.toFixed(2)) }
  })

  const topUbicaciones = [...datosUbicacion].sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

  const agrupadoTrimestre = data.reduce((acc: Record<string, number>, centro) => {
    const fecha = new Date(centro.fecha_registro)
    const trimestre = `T${Math.floor(fecha.getMonth() / 3) + 1}`
    acc[trimestre] = (acc[trimestre] || 0) + 1
    return acc
  }, {})
  const datosTrimestres = Object.entries(agrupadoTrimestre).map(([trimestre, cantidad]) => ({ trimestre, cantidad }))

  const centrosSinTelefono = data.filter((c) => !c.telefono).length

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 bg-gray-50 rounded-xl shadow-inner">
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Estadísticas de Centros de Formación
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Centros</p>
          <p className="text-2xl font-bold text-indigo-700">{totalCentros}</p>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Ubicaciones únicas</p>
          <p className="text-2xl font-bold text-teal-700">{totalUbicaciones}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Mes más activo</p>
          <p className="text-xl font-semibold text-yellow-700">{mesMasActivo}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Sin teléfono</p>
          <p className="text-2xl font-bold text-red-600">{centrosSinTelefono}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div className="bg-white rounded-2xl shadow-lg p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Top Ubicaciones</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUbicaciones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ubicacion" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white rounded-2xl shadow-lg p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Distribución por Ubicación</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={datosUbicacion.map(d => ({ name: d.ubicacion, value: d.cantidad }))} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {datosUbicacion.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className="bg-white rounded-2xl shadow-lg p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Crecimiento Mensual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosCrecimiento}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line type="monotone" dataKey="crecimiento" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="bg-white rounded-2xl shadow-lg p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Registros por Trimestre</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosTrimestres}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trimestre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default EstadisticasCentros
