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
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from '@/Api/Solicitudes';
import { getUsuarios } from '@/Api/Usuariosform';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ID_ROL_ACTUAL = 3; 

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Fecha', uid: 'fecha', sortable: true },
  { name: 'Estado', uid: 'estado', sortable: false },
  { name: 'Solicitante', uid: 'solicitante', sortable: false },
  { name: '# Detalles', uid: 'detalles', sortable: false },
  { name: '# Entregas', uid: 'entregas', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'fecha',
  'estado',
  'solicitante',
  'detalles',
  'entregas',
  'actions',
];

const SolicitudesPage = () => {
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [estado, setEstado] = useState<'PENDIENTE' | 'APROBADA' | 'RECHAZADA'>(
    'PENDIENTE'
  );
  const [idSolicitante, setIdSolicitante] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    cargarPermisos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPermisos = async () => {
    try {
      const permisosObtenidos = await getPermisosPorRuta('/SolicitudesPage', ID_ROL_ACTUAL);
      setPermisos(permisosObtenidos);
      if (permisosObtenidos.puedeVer) {
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
    }
  };

  const cargarDatos = async () => {
    try {
      const [sols, users] = await Promise.all([getSolicitudes(), getUsuarios()]);
      setSolicitudes(sols);
      setUsuarios(users);
    } catch (err) {
      console.error('Error cargando solicitudes', err);
    }
  };

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) return;
    if (!window.confirm('¿Eliminar solicitud? No se podrá recuperar.')) return;
    await deleteSolicitud(id);
    notify(`🗑️ Solicitud eliminada: ID ${id}`);
    cargarDatos();
  };

  const guardar = async () => {
    if (editId && !permisos.puedeEditar) return;
    if (!editId && !permisos.puedeCrear) return;
    const payload = {
      fechaSolicitud,
      estadoSolicitud: estado,
      idUsuarioSolicitante: idSolicitante ? { id: Number(idSolicitante) } : undefined,
    };
    if (editId) {
      await updateSolicitud(editId, payload);
      notify('✏️ Solicitud actualizada');
    } else {
      await createSolicitud(payload);
      notify('✅ Solicitud creada');
    }
    limpiarForm();
    onClose();
    cargarDatos();
  };

  const abrirModalEditar = (s: any) => {
    if (!permisos.puedeEditar) return;
    setEditId(s.id);
    setFechaSolicitud(s.fechaSolicitud);
    setEstado(
      s.estadoSolicitud === 'RECHAZADA'
        ? 'RECHAZADA'
        : s.estadoSolicitud === 'APROBADA'
        ? 'APROBADA'
        : 'PENDIENTE'
    );
    setIdSolicitante(s.idUsuarioSolicitante?.id || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setFechaSolicitud('');
    setEstado('PENDIENTE');
    setIdSolicitante('');
  };

  const filtered = useMemo(
    () =>
      filterValue
        ? solicitudes.filter((s) =>
            (
              `${s.id} ${s.fechaSolicitud} ${s.estadoSolicitud} ${s.idUsuarioSolicitante?.nombre || ''} ${
                s.idUsuarioSolicitante?.apellido || ''
              }`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : solicitudes,
    [solicitudes, filterValue]
  );

  const pages = Math.ceil(filtered.length / rowsPerPage) || 1;

  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;
    items.sort((a, b) => {
      const x = a[column === 'fecha' ? 'fechaSolicitud' : column];
      const y = b[column === 'fecha' ? 'fechaSolicitud' : column];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'fecha':
        return <span className="text-sm text-gray-600">{item.fechaSolicitud}</span>;
      case 'estado':
        return (
          <span
            className={`text-sm font-medium ${
              item.estadoSolicitud === 'RECHAZADA'
                ? 'text-red-600'
                : item.estadoSolicitud === 'APROBADA'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {item.estadoSolicitud}
          </span>
        );
      case 'solicitante':
        return (
          <span className="text-sm text-gray-800">
            {item.idUsuarioSolicitante
              ? `${item.idUsuarioSolicitante.nombre} ${item.idUsuarioSolicitante.apellido || ''}`
              : '—'}
          </span>
        );
      case 'detalles':
        return (
          <span className="text-sm text-gray-600">
            {item.detalleSolicituds?.length || 0}
          </span>
        );
      case 'entregas':
        return (
          <span className="text-sm text-gray-600">
            {item.entregaMaterials?.length || 0}
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
              {[
                permisos.puedeEditar ? (
                  <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
                    Editar
                  </DropdownItem>
                ) : null,
                permisos.puedeEliminar ? (
                  <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)}>
                    Eliminar
                  </DropdownItem>
                ) : null,
              ].filter(Boolean)}
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

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          className="w-full md:max-w-[44%]"
          radius="lg"
          placeholder="Buscar por nombre, estado o fecha"
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
                limpiarForm();
                onOpen();
              }}
            >
              Nueva Solicitud
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {solicitudes.length} solicitudes
        </span>
        <label className="flex items-center text-default-400 text-sm">
          Filas por página:&nbsp;
          <select
            className="bg-transparent outline-none text-default-600 ml-1"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
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
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center gap-2">
      <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
        Anterior
      </Button>
      <Pagination isCompact showControls page={page} total={pages} onChange={setPage} />
      <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>
        Siguiente
      </Button>
    </div>
  );

  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📝 Gestión de Solicitudes
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra las solicitudes de materiales.
          </p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de solicitudes"
            isHeaderSticky
            topContent={topContent}
            bottomContent={bottomContent}
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
                  width={col.uid === 'solicitante' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron solicitudes">
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
            <p className="text-center text-gray-500">No se encontraron solicitudes</p>
          )}
          {sorted.map((s) => (
            <Card key={s.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">ID {s.id}</h3>
                  {(permisos.puedeEditar || permisos.puedeEliminar) && (
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
                        {[
                          permisos.puedeEditar ? (
                            <DropdownItem key={`editar-${s.id}`} onPress={() => abrirModalEditar(s)}>
                              Editar
                            </DropdownItem>
                          ) : null,
                          permisos.puedeEliminar ? (
                            <DropdownItem key={`eliminar-${s.id}`} onPress={() => eliminar(s.id)}>
                              Eliminar
                            </DropdownItem>
                          ) : null,
                        ].filter(Boolean)}
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha:</span> {s.fechaSolicitud}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Estado:</span>{' '}
                  <span
                    className={
                      s.estadoSolicitud === 'RECHAZADA'
                        ? 'text-red-600'
                        : s.estadoSolicitud === 'APROBADA'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }
                  >
                    {s.estadoSolicitud}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Solicitante:</span>{' '}
                  {s.idUsuarioSolicitante
                    ? `${s.idUsuarioSolicitante.nombre} ${
                        s.idUsuarioSolicitante.apellido || ''
                      }`
                    : '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Detalles:</span>{' '}
                  {s.detalleSolicituds?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Entregas:</span>{' '}
                  {s.entregaMaterials?.length || 0}
                </p>
                <p className="text-xs text-gray-400">ID: {s.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {(onCloseLocal) => (
              <>
                <ModalHeader>
                  {editId ? 'Editar Solicitud' : 'Nueva Solicitud'}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    type="date"
                    label="Fecha"
                    value={fechaSolicitud}
                    onValueChange={setFechaSolicitud}
                    radius="sm"
                  />
                  {/* Estado */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Estado
                    </label>
                    <select
                      value={estado}
                      onChange={(e) =>
                        setEstado(e.target.value as 'PENDIENTE' | 'APROBADA' | 'RECHAZADA')
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="APROBADA">APROBADA</option>
                      <option value="RECHAZADA">RECHAZADA</option>
                    </select>
                  </div>
                  {/* Solicitante */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Solicitante
                    </label>
                    <select
                      value={idSolicitante}
                      onChange={(e) => setIdSolicitante(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onCloseLocal}>
                    Cancelar
                  </Button>
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

export default SolicitudesPage;
