import React, { useEffect, useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  Column,
  HeaderGroup,
  Row,
} from 'react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface CentroFormacion {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  fecha_registro: string;
}

const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: (filterValue: string) => void;
}) => {
  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="mb-4 p-2 border border-gray-300 rounded w-full"
    />
  );
};

const Reports: React.FC = () => {
  const [data, setData] = useState<CentroFormacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3100/API/CentroFormacion')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener datos:', err);
        setLoading(false);
      });
  }, []);

  const columns: Column<CentroFormacion>[] = useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Ubicación',
        accessor: 'ubicacion',
      },
      {
        Header: 'Teléfono',
        accessor: 'telefono',
      },
      {
        Header: 'Fecha de Registro',
        accessor: 'fecha_registro',
        Cell: ({ value }: { value: string }) =>
          new Date(value).toLocaleString('es-CO'),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
  } = useTable<CentroFormacion>({ columns, data }, useGlobalFilter, useSortBy);

  // 🔢 Agrupar por ubicación
  const ubicaciones = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    data.forEach((centro) => {
      grouped[centro.ubicacion] = (grouped[centro.ubicacion] || 0) + 1;
    });

    return Object.entries(grouped).map(([ubicacion, cantidad]) => ({
      ubicacion,
      cantidad,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Centros de Formación</h2>

      <GlobalFilter
        globalFilter={(state as any).globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* 📊 Gráfica de centros por ubicación */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Centros por ubicación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ubicaciones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ubicacion" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Tabla */}
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden"
      >
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup: HeaderGroup<CentroFormacion>) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-3 px-4 text-left font-semibold text-sm text-gray-700 cursor-pointer select-none"
                >
                  {column.render('Header')}
                  <span className="ml-1">
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row: Row<CentroFormacion>) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    className="py-2 px-4 border-t border-gray-200 text-sm text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
