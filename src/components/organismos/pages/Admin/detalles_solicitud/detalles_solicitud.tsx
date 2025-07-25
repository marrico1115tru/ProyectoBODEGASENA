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
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
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
  getDetalleSolicitudes,
  createDetalleSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from '@/Api/detalles_solicitud';
import { getProductos } from '@/Api/Productosform';
import { getSolicitudes } from '@/Api/Solicitudes';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ID_ROL_ACTUAL = 1;

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Cantidad', uid: 'cantidadSolicitada', sortable: false },
  { name: 'Observaciones', uid: 'observaciones', sortable: false },
  { name: 'Producto', uid: 'producto', sortable: false },
  { name: 'Solicitud', uid: 'solicitud', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'cantidadSolicitada',
  'observaciones',
  'producto',
  'solicitud',
  'actions',
];

const DetalleSolicitudesPage = () => {
  const [detalles, setDetalles] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });
  const [loadingPermisos, setLoadingPermisos] = useState(true);

  const [cantidad, setCantidad] = useState<number | undefined>(undefined);
  const [observaciones, setObservaciones] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    setLoadingPermisos(true);
    try {
      const p = await getPermisosPorRuta('/DetalleSolicitudPage', ID_ROL_ACTUAL);
      setPermisos(p.data || p);
      if ((p.data || p).puedeVer) {
        cargarDatos();
      }
    } catch (error) {
      console.error('Error cargando permisos:', error);
      setPermisos({
        puedeVer: false,
        puedeCrear: false,
        puedeEditar: false,
        puedeEliminar: false,
      });
      await MySwal.fire('Error', 'No se pudieron cargar los permisos', 'error');
    } finally {
      setLoadingPermisos(false);
    }
  };

  const cargarDatos = async () => {
    try {
      const [det, prods, sols] = await Promise.all([getDetalleSolicitudes(), getProductos(), getSolicitudes()]);
      setDetalles(det);
      setProductos(prods);
      setSolicitudes(sols);
    } catch (err) {
      console.error('Error cargando datos', err);
      await MySwal.fire('Error', 'Error cargando datos', 'error');
    }
  };

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) return;
    const result = await MySwal.fire({
      title: '¿Eliminar registro?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDetalleSolicitud(id);
      await MySwal.fire('Eliminado', `Registro eliminado: ID ${id}`, 'success');
      await cargarDatos();
    } catch {
      await MySwal.fire('Error', 'Error eliminando registro', 'error');
    }
  };

  const guardar = async () => {
    if (!permisos.puedeCrear && !permisos.puedeEditar) return;

    if (!cantidad || cantidad <= 0) {
      await MySwal.fire('Error', 'La cantidad solicitada debe ser mayor que cero', 'error');
      return;
    }
    if (!productoSeleccionado) {
      await MySwal.fire('Error', 'Debes seleccionar un producto', 'error');
      return;
    }
    if (!solicitudSeleccionada) {
      await MySwal.fire('Error', 'Debes seleccionar una solicitud', 'error');
      return;
    }

    const payload = {
      cantidadSolicitada: cantidad,
      observaciones: observaciones || null,
      idProducto: {
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
      },
      idSolicitud: {
        id: solicitudSeleccionada.id,
      },
    };

    try {
      if (editId) {
        if (!permisos.puedeEditar) return;
        await updateDetalleSolicitud(editId, payload);
        await MySwal.fire('Éxito', 'Detalle actualizado', 'success');
      } else {
        if (!permisos.puedeCrear) return;
        await createDetalleSolicitud(payload);
        await MySwal.fire('Éxito', 'Detalle creado', 'success');
      }
      onClose();
      limpiarFormulario();
      await cargarDatos();
    } catch {
      await MySwal.fire('Error', 'Error guardando registro', 'error');
    }
  };

  const abrirModalEditar = (d: any) => {
    setEditId(d.id);
    setCantidad(d.cantidadSolicitada);
    setObservaciones(d.observaciones || '');
    setProductoSeleccionado(d.idProducto);
    setSolicitudSeleccionada(d.idSolicitud);
    onOpen();
  };

  const limpiarFormulario = () => {
    setEditId(null);
    setCantidad(undefined);
    setObservaciones('');
    setProductoSeleccionado(null);
    setSolicitudSeleccionada(null);
  };

  const filtered = useMemo(() => {
    return filterValue
      ? detalles.filter((d) =>
          (
            `${d.cantidadSolicitada} ${d.observaciones || ''} ${
              d.idProducto?.nombre || ''
            } ${d.idSolicitud?.estadoSolicitud || ''}`
          )
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        )
      : detalles;
  }, [detalles, filterValue]);

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
      case 'cantidadSolicitada':
        return <span className="text-sm text-gray-800">{item.cantidadSolicitada}</span>;
      case 'observaciones':
        return (
          <span className="text-sm text-gray-600 break-words max-w-[16rem]">
            {item.observaciones || '—'}
          </span>
        );
      case 'producto':
        return (
          <span className="text-sm text-gray-600">
            {item.idProducto?.nombre || '—'}
          </span>
        );
      case 'solicitud':
        return (
          <span className="text-sm text-gray-600">
            {item.idSolicitud?.estadoSolicitud || '—'}
          </span>
        );
      case 'actions':
        if (!permisos.puedeEditar && !permisos.puedeEliminar) return null;
        return (
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
              {permisos.puedeEditar ? (
                <DropdownItem onPress={() => abrirModalEditar(item)} key={`editar-${item.id}`}>
                  Editar
                </DropdownItem>
              ) : null}
              {permisos.puedeEliminar ? (
                <DropdownItem onPress={() => eliminar(item.id)} key={`eliminar-${item.id}`}>
                  Eliminar
                </DropdownItem>
              ) : null}
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
      if (copy.has(key)) copy.delete(key);
      else copy.add(key);
      return copy;
    });
  };

  if (loadingPermisos) {
    return (
      <DefaultLayout>
        <div className="p-6">
          <div className="bg-blue-100 text-blue-700 p-4 rounded shadow text-center">
            Cargando permisos...
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6">
          <div className="bg-red-100 text-red-700 p-4 rounded shadow text-center">
            No tienes permiso para ver esta página.
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📝 Detalle de Solicitudes
          </h1>
          <p className="text-sm text-gray-600">Gestiona los ítems de cada solicitud.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla detalle solicitud"
            isHeaderSticky
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por observación, producto o estado"
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
                    {permisos.puedeCrear && (
                      <Button
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                        endContent={<PlusIcon />}
                        onPress={() => {
                          limpiarFormulario();
                          onOpen();
                        }}
                      >
                        Nuevo Detalle
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {detalles.length} registros</span>
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
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            }
            bottomContent={
              <div className="py-2 px-2 flex justify-center items-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={page === 1}
                  onPress={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                <Pagination
                  isCompact
                  showControls
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={page === pages}
                  onPress={() => setPage(page + 1)}
                >
                  Siguiente
                </Button>
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
                  width={col.uid === 'observaciones' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron registros">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as string)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron registros</p>
          )}
          {sorted.map((d) => (
            <Card key={d.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">Cant: {d.cantidadSolicitada}</h3>
                  {(permisos.puedeEditar || permisos.puedeEliminar) ? (
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
                        {permisos.puedeEditar ? (
                          <DropdownItem onPress={() => abrirModalEditar(d)} key={`editar-${d.id}`}>Editar</DropdownItem>
                        ) : null}
                        {permisos.puedeEliminar ? (
                          <DropdownItem onPress={() => eliminar(d.id)} key={`eliminar-${d.id}`}>Eliminar</DropdownItem>
                        ) : null}
                      </DropdownMenu>
                    </Dropdown>
                  ) : null}
                </div>
                <p className="text-sm text-gray-600 break-words">
                  <span className="font-medium">Obs:</span> {d.observaciones || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Producto:</span> {d.idProducto?.nombre || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Solicitud:</span>{' '}
                  {d.idSolicitud?.estadoSolicitud || '—'}
                </p>
                <p className="text-xs text-gray-400">ID: {d.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30">
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {(onCloseLocal) => (
              <>
                <ModalHeader>{editId ? 'Editar Detalle' : 'Nuevo Detalle'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Cantidad solicitada"
                    placeholder="Ej: 10"
                    type="number"
                    value={typeof cantidad === 'number' ? cantidad.toString() : ''}
                    onValueChange={(v) => setCantidad(v ? Number(v) : undefined)}
                    radius="sm"
                  />
                  <Input
                    label="Observaciones"
                    placeholder="Observaciones (opcional)"
                    value={observaciones}
                    onValueChange={setObservaciones}
                    radius="sm"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Producto
                    </label>
                    <select
                      value={productoSeleccionado?.id || ''}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        const producto = productos.find((p) => p.id === id) || null;
                        setProductoSeleccionado(producto);
                      }}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Solicitud
                    </label>
                    <select
                      value={solicitudSeleccionada?.id || ''}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        const solicitud = solicitudes.find((s) => s.id === id) || null;
                        setSolicitudSeleccionada(solicitud);
                      }}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una solicitud</option>
                      {solicitudes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {`${s.id} - ${s.estadoSolicitud}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onCloseLocal}>Cancelar</Button>
                  <Button variant="flat" onPress={guardar}>{editId ? 'Actualizar' : 'Crear'}</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default DetalleSolicitudesPage;
