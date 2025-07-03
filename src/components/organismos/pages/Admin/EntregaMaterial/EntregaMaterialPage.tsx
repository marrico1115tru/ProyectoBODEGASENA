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
  getEntregasMaterial,
  createEntregaMaterial,
  updateEntregaMaterial,
  deleteEntregaMaterial,
} from '@/Api/entregaMaterial';
import { getFichasFormacion } from '@/Api/fichasFormacion';
import { getSolicitudes } from '@/Api/Solicitudes';
import { getUsuarios } from '@/Api/Usuariosform';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ID_ROL_ACTUAL = 1; // Ajusta según tu sistema de autenticación

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Fecha', uid: 'fecha', sortable: false },
  { name: 'Observaciones', uid: 'observaciones', sortable: false },
  { name: 'Ficha', uid: 'ficha', sortable: false },
  { name: 'Solicitud', uid: 'solicitud', sortable: false },
  { name: 'Responsable', uid: 'responsable', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'fecha',
  'observaciones',
  'ficha',
  'solicitud',
  'responsable',
  'actions',
];

const EntregaMaterialPage = () => {
  /* Estado principal de datos */
  const [entregas, setEntregas] = useState<any[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
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

  /* Permisos y estado de carga */
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });
  const [loadingPermisos, setLoadingPermisos] = useState(true);

  /* Formulario modal */
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [idFicha, setIdFicha] = useState<number | ''>('');
  const [idSolicitud, setIdSolicitud] = useState<number | ''>('');
  const [idResponsable, setIdResponsable] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  /* UI */
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* Carga inicial de permisos y datos */
  useEffect(() => {
    const initPage = async () => {
      setLoadingPermisos(true);
      try {
        const p = await getPermisosPorRuta('/EntregaMaterialPage', ID_ROL_ACTUAL);
        setPermisos(p.data || p); // Asegura compatibilidad con { data: ... } o solo el objeto
        if ((p.data || p).puedeVer) {
          await cargarDatos();
        }
      } catch (error) {
        console.error('Error cargando permisos:', error);
        setPermisos({
          puedeVer: false,
          puedeCrear: false,
          puedeEditar: false,
          puedeEliminar: false,
        });
      } finally {
        setLoadingPermisos(false);
      }
    };
    initPage();
    // eslint-disable-next-line
  }, []);

  const cargarDatos = async () => {
    try {
      const [ents, fich, sols, usrs] = await Promise.all([
        getEntregasMaterial(),
        getFichasFormacion(),
        getSolicitudes(),
        getUsuarios(),
      ]);
      setEntregas(ents);
      setFichas(fich);
      setSolicitudes(sols);
      setUsuarios(usrs);
    } catch (err) {
      console.error('Error cargando datos', err);
    }
  };

  /* CRUD con protección de permisos */
  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      notify('No tienes permiso para eliminar');
      return;
    }
    if (!confirm('¿Eliminar entrega? No se podrá recuperar.')) return;
    try {
      await deleteEntregaMaterial(id);
      notify(`🗑️ Entrega eliminada: ID ${id}`);
      cargarDatos();
    } catch (e) {
      notify('Error eliminando entrega');
      console.error(e);
    }
  };

  const guardar = async () => {
    if (editId && !permisos.puedeEditar) {
      notify('No tienes permiso para editar');
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      notify('No tienes permiso para crear');
      return;
    }
    // Validaciones básicas del formulario
    if (!fechaEntrega || !idFicha || !idSolicitud || !idResponsable) {
      notify('Completa todos los campos obligatorios');
      return;
    }

    const payload = {
      fechaEntrega,
      observaciones: observaciones || null,
      idFichaFormacion: { id: Number(idFicha) },
      idSolicitud: { id: Number(idSolicitud) },
      idUsuarioResponsable: { id: Number(idResponsable) },
    };
    try {
      if (editId) {
        await updateEntregaMaterial(editId, payload);
        notify('✅ Entrega actualizada');
      } else {
        await createEntregaMaterial(payload);
        notify('✅ Entrega creada');
      }
      onClose();
      limpiarFormulario();
      cargarDatos();
    } catch (e) {
      notify('Error guardando entrega');
      console.error(e);
    }
  };

  const abrirModalEditar = (e: any) => {
    if (!permisos.puedeEditar) {
      notify('No tienes permiso para editar');
      return;
    }
    setEditId(e.id);
    setFechaEntrega(e.fechaEntrega);
    setObservaciones(e.observaciones || '');
    setIdFicha(e.idFichaFormacion?.id || '');
    setIdSolicitud(e.idSolicitud?.id || '');
    setIdResponsable(e.idUsuarioResponsable?.id || '');
    onOpen();
  };

  const limpiarFormulario = () => {
    setEditId(null);
    setFechaEntrega('');
    setObservaciones('');
    setIdFicha('');
    setIdSolicitud('');
    setIdResponsable('');
  };

  /* Filtro + Orden + Paginación */
  const filtered = useMemo(
    () =>
      filterValue
        ? entregas.filter((e) =>
            (
              `${e.fechaEntrega} ${e.observaciones || ''} ${
                e.idFichaFormacion?.nombre || ''
              } ${e.idSolicitud?.estadoSolicitud || ''} ${
                e.idUsuarioResponsable?.nombre || ''
              }`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : entregas,
    [entregas, filterValue]
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
      const x = a[column as keyof typeof a];
      const y = b[column as keyof typeof b];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  /* Renderizado de celdas */
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'fecha':
        return <span className="text-sm text-gray-800">{item.fechaEntrega}</span>;
      case 'observaciones':
        return (
          <span className="text-sm text-gray-600 break-words max-w-[16rem]">
            {item.observaciones || '—'}
          </span>
        );
      case 'ficha':
        return (
          <span className="text-sm text-gray-600">
            {item.idFichaFormacion?.nombre || '—'}
          </span>
        );
      case 'solicitud':
        return (
          <span className="text-sm text-gray-600">
            {item.idSolicitud?.estadoSolicitud || '—'}
          </span>
        );
      case 'responsable':
        return (
          <span className="text-sm text-gray-600">
            {item.idUsuarioResponsable
              ? `${item.idUsuarioResponsable.nombre} ${item.idUsuarioResponsable.apellido}`
              : '—'}
          </span>
        );
      case 'actions':
        // No renderiza acciones si no hay permisos de edición o eliminación
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
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  /* Contenido superior de la tabla */
  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          className="w-full md:max-w-[44%]"
          radius="lg"
          placeholder="Buscar por ficha, solicitud o responsable"
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
          {permisos.puedeCrear && ( // Botón "Nueva Entrega" visible solo con permiso de crear
            <Button
              className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
              endContent={<PlusIcon />}
              onPress={() => {
                limpiarFormulario();
                onOpen();
              }}
            >
              Nueva Entrega
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {entregas.length} entregas
        </span>
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
  );

  /* Contenido inferior de la tabla (paginación) */
  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center gap-2">
      <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
        Anterior
      </Button>
      <Pagination isCompact showControls page={page} total={pages} onChange={setPage} />
      <Button
        size="sm"
        variant="flat"
        isDisabled={page === pages}
        onPress={() => setPage(page + 1)}
      >
        Siguiente
      </Button>
    </div>
  );

  /* Renderizado condicional basado en permisos y carga */
  if (loadingPermisos) {
    return (
      <DefaultLayout>
        <div className="p-6 flex justify-center items-center h-64">
          <span className="text-gray-500 text-lg">Cargando permisos...</span>
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

  /* Renderizado de la página principal */
  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        {/* Encabezado */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📦 Entrega de Material
          </h1>
          <p className="text-sm text-gray-600">
            Registra y gestiona las entregas a programas y solicitudes.
          </p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de entregas"
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
                  width={col.uid === 'observaciones' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron entregas">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as string)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards móvil */}
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron entregas</p>
          )}
          {sorted.map((e) => (
            <Card key={e.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">Entrega ID {e.id}</h3>
                  {(permisos.puedeEditar || permisos.puedeEliminar) ? ( // Mostrar Dropdown solo si hay permisos
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
                          <DropdownItem onPress={() => abrirModalEditar(e)} key={`editar-${e.id}`}>
                            Editar
                          </DropdownItem>
                        ) : null}
                        {permisos.puedeEliminar ? (
                          <DropdownItem onPress={() => eliminar(e.id)} key={`eliminar-${e.id}`}>
                            Eliminar
                          </DropdownItem>
                        ) : null}
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    null // Si no hay permisos, no renderiza el Dropdown
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha:</span> {e.fechaEntrega}
                </p>
                <p className="text-sm text-gray-600 break-words">
                  <span className="font-medium">Obs:</span> {e.observaciones || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ficha:</span> {e.idFichaFormacion?.nombre || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Solicitud:</span> {e.idSolicitud?.estadoSolicitud || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Responsable:</span>{' '}
                  {e.idUsuarioResponsable
                    ? `${e.idUsuarioResponsable.nombre} ${e.idUsuarioResponsable.apellido}`
                    : '—'}
                </p>
                <p className="text-xs text-gray-400">ID: {e.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal CRUD */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {(onCloseLocal) => (
              <>
                <ModalHeader>{editId ? 'Editar Entrega' : 'Nueva Entrega'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Fecha de entrega (YYYY-MM-DD)"
                    placeholder="2025-06-22"
                    value={fechaEntrega}
                    onValueChange={setFechaEntrega}
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
                      Ficha Formación
                    </label>
                    <select
                      value={idFicha}
                      onChange={(e) => setIdFicha(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una ficha</option>
                      {fichas.map((f: any) => (
                        <option key={f.id} value={f.id}>
                          {f.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Solicitud
                    </label>
                    <select
                      value={idSolicitud}
                      onChange={(e) => setIdSolicitud(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una solicitud</option>
                      {solicitudes.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {`${s.id} - ${s.estadoSolicitud}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Responsable
                    </label>
                    <select
                      value={idResponsable}
                      onChange={(e) => setIdResponsable(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un responsable</option>
                      {usuarios.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {`${u.nombre} ${u.apellido}`}
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

export default EntregaMaterialPage;
