import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Checkbox,
  useDisclosure,
  type SortDescriptor,
} from '@heroui/react';
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from '@/Api/Movimientosform';
import { getInventarios } from '@/Api/inventario';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Tipo', uid: 'tipo', sortable: false },
  { name: 'Cantidad', uid: 'cantidad', sortable: false },
  { name: 'Fecha', uid: 'fecha', sortable: false },
  { name: 'Inventario', uid: 'inventario', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = ['id', 'tipo', 'cantidad', 'fecha', 'inventario', 'actions'];

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [idInventario, setIdInventario] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [movs, invs] = await Promise.all([getMovimientos(), getInventarios()]);
      setMovimientos(movs);
      setInventarios(invs);
    } catch (error) {
      console.error('Error cargando datos:', error);
      await MySwal.fire('Error', 'No se pudo cargar los datos', 'error');
    }
  };

  const eliminar = async (id: number) => {
    const result = await MySwal.fire({
      title: '¿Eliminar movimiento?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteMovimiento(id);
      await MySwal.fire('Eliminado', `Movimiento eliminado: ID ${id}`, 'success');
      cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error eliminando el movimiento', 'error');
    }
  };

  const guardar = async () => {
    if (!cantidad || cantidad <= 0) {
      await MySwal.fire('Error', 'La cantidad debe ser mayor que cero', 'error');
      return;
    }
    if (!fecha) {
      await MySwal.fire('Error', 'La fecha es obligatoria', 'error');
      return;
    }
    if (!idInventario) {
      await MySwal.fire('Error', 'Debe seleccionar un inventario', 'error');
      return;
    }

    const inventarioSeleccionado = inventarios.find(inv => inv.idProductoInventario === Number(idInventario));
    if (!inventarioSeleccionado) {
      await MySwal.fire('Error', 'Inventario seleccionado no válido', 'error');
      return;
    }

    const payload = {
      id: editId ?? 0,
      tipoMovimiento,
      cantidad: Number(cantidad),
      fechaMovimiento: fecha,
      idProductoInventario: {
        idProductoInventario: inventarioSeleccionado.idProductoInventario,
        stock: inventarioSeleccionado.stock,
        nombre: inventarioSeleccionado.nombre,
        cantidadDisponible: inventarioSeleccionado.cantidadDisponible,
      },
    };

    try {
      if (editId) {
        await updateMovimiento(editId, payload);
        await MySwal.fire('Actualizado', 'Movimiento actualizado', 'success');
      } else {
        await createMovimiento(payload);
        await MySwal.fire('Creado', 'Movimiento creado', 'success');
      }
      limpiarForm();
      onClose();
      cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error guardando movimiento', 'error');
    }
  };

  const abrirModalEditar = (m: any) => {
    setEditId(m.id);
    setTipoMovimiento(m.tipoMovimiento);
    setCantidad(m.cantidad);
    setFecha(m.fechaMovimiento);
    setIdInventario(m.idProductoInventario?.idProductoInventario || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setTipoMovimiento('ENTRADA');
    setCantidad('');
    setFecha('');
    setIdInventario('');
  };

  const filtered = useMemo(() => {
    if (!filterValue) return movimientos;
    return movimientos.filter((m) =>
      `${m.tipoMovimiento} ${m.cantidad} ${m.fechaMovimiento} ${m.idProductoInventario?.idProductoInventario || ''}`
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [movimientos, filterValue]);

  const pages = Math.ceil(filtered.length / rowsPerPage) || 1;

  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;
    items.sort((a, b) => {
      const x = a[column as keyof typeof a];
      const y = b[column as keyof typeof b];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'tipo':
        return <span className="text-sm text-gray-800">{item.tipoMovimiento}</span>;
      case 'cantidad':
        return <span className="text-sm text-gray-800">{item.cantidad}</span>;
      case 'fecha':
        return <span className="text-sm text-gray-600">{item.fechaMovimiento}</span>;
      case 'inventario':
        return <span className="text-sm text-gray-600">{item.idProductoInventario?.idProductoInventario ?? '—'}</span>;
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onPress={() => abrirModalEditar(item)} key="editar">Editar</DropdownItem>
              <DropdownItem onPress={() => eliminar(item.id)} key="eliminar">Eliminar</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item];
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            🔄 Movimientos de Inventario
          </h1>
          <p className="text-sm text-gray-600">
            Registra y gestiona entradas y salidas de inventario.
          </p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de movimientos"
            isHeaderSticky
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por tipo, fecha o inventario"
                    startContent={<SearchIcon className="text-[#0D1324]" />}
                    value={filterValue}
                    onValueChange={setFilterValue}
                    onClear={() => setFilterValue('')}
                  />
                  <div className="flex gap-3">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat">Columnas</Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Seleccionar columnas">
                        {columns
                          .filter((c) => c.uid !== 'actions')
                          .map((col) => (
                            <DropdownItem key={col.uid} className="py-1 px-2">
                              <Checkbox
                                isSelected={visibleColumns.has(col.uid)}
                                onValueChange={() => toggleColumn(col.uid)}
                                size="sm"
                              >
                                {col.name}
                              </Checkbox>
                            </DropdownItem>
                          ))}
                      </DropdownMenu>
                    </Dropdown>
                    <Button
                      className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                      endContent={<PlusIcon />}
                      onPress={() => {
                        limpiarForm();
                        onOpen();
                      }}
                    >
                      Nuevo Movimiento
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {movimientos.length} movimientos</span>
                  <label className="flex items-center text-default-400 text-sm">
                    Filas por página:&nbsp;
                    <select
                      className="bg-transparent outline-none text-default-600 ml-1"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value));
                        setPage(1);
                      }}
                    >
                      {[5, 10, 15].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            }
            bottomContent={
              <div className="py-2 px-2 flex justify-center items-center gap-2">
                <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>Anterior</Button>
                <Pagination isCompact showControls page={page} total={pages} onChange={setPage} />
                <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>Siguiente</Button>
              </div>
            }
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              th: 'py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm',
              td: 'align-middle py-3 px-4',
            }}
          >
            <TableHeader columns={columns.filter((c) => visibleColumns.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron movimientos">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, String(col))}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron movimientos</p>
          )}
          {sorted.map((m) => (
            <Card key={m.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {m.tipoMovimiento}: {m.cantidad}
                  </h3>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="rounded-full text-[#0D1324]"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem onPress={() => abrirModalEditar(m)} key="editar">Editar</DropdownItem>
                      <DropdownItem onPress={() => eliminar(m.id)} key="eliminar">Eliminar</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha:</span> {m.fechaMovimiento}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Inventario:</span>{' '}
                  {m.idProductoInventario?.idProductoInventario ?? '—'}
                </p>
                <p className="text-xs text-gray-400">ID: {m.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30">
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {(onCloseLocal) => (
              <>
                <ModalHeader>{editId ? 'Editar Movimiento' : 'Nuevo Movimiento'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Tipo de movimiento
                    </label>
                    <select
                      value={tipoMovimiento}
                      onChange={(e) => setTipoMovimiento(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ENTRADA">ENTRADA</option>
                      <option value="SALIDA">SALIDA</option>
                    </select>
                  </div>
                  <Input
                    label="Cantidad"
                    placeholder="Ej: 100"
                    type="number"
                    value={cantidad.toString()}
                    onValueChange={(v) => setCantidad(v ? Number(v) : '')}
                    radius="sm"
                  />
                  <Input
                    label="Fecha (YYYY-MM-DD)"
                    placeholder="2025-06-21"
                    value={fecha}
                    onValueChange={setFecha}
                    radius="sm"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Producto Inventario
                    </label>
                    <select
                      value={idInventario}
                      onChange={(e) => setIdInventario(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un inventario</option>
                      {inventarios.map((inv) => (
                        <option key={inv.idProductoInventario} value={inv.idProductoInventario}>
                          {inv.idProductoInventario} - Stock: {inv.stock}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onCloseLocal}>Cancelar</Button>
                  <Button variant="flat" onPress={guardar}>
                    {editId ? 'Actualizar' : 'Crear'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default MovimientosPage;