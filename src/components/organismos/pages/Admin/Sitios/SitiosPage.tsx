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
  getSitios,
  createSitio,
  updateSitio,
  deleteSitio,
} from '@/Api/SitioService';
import { getAreas } from '@/Api/AreasService';
import { getTiposSitio } from '@/Api/Tipo_sitios';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ID_ROL_ACTUAL = 1; // Ajusta según el rol actual del usuario

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: 'Ubicación', uid: 'ubicacion', sortable: false },
  { name: 'Estado', uid: 'estado', sortable: false },
  { name: 'Área', uid: 'area', sortable: false },
  { name: 'Tipo', uid: 'tipo', sortable: false },
  { name: '# Inventarios', uid: 'inventarios', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombre',
  'ubicacion',
  'estado',
  'area',
  'tipo',
  'inventarios',
  'actions',
];

const SitiosPage = () => {
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const [sitios, setSitios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
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

  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [estado, setEstado] = useState<'ACTIVO' | 'INACTIVO'>('ACTIVO');
  const [idArea, setIdArea] = useState<number | ''>('');
  const [idTipo, setIdTipo] = useState<number | ''>('');
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
      const permisosObtenidos = await getPermisosPorRuta('/SitiosPage', ID_ROL_ACTUAL);
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
      const [s, a, t] = await Promise.all([
        getSitios(),
        getAreas(),
        getTiposSitio(),
      ]);
      setSitios(s);
      setAreas(a);
      setTipos(t);
    } catch (err) {
      console.error('Error cargando sitios', err);
    }
  };

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) return;
    if (!window.confirm('¿Eliminar sitio? No se podrá recuperar.')) return;
    await deleteSitio(id);
    notify(`🗑️ Sitio eliminado: ID ${id}`);
    cargarDatos();
  };

  const guardar = async () => {
    if (editId && !permisos.puedeEditar) return;
    if (!editId && !permisos.puedeCrear) return;
    const payload = {
      nombre,
      ubicacion,
      estado,
      id_area: idArea || undefined,
      id_tipo_sitio: idTipo || undefined,
    };
    if (editId) {
      await updateSitio(editId, payload);
      notify('✏️ Sitio actualizado');
    } else {
      await createSitio(payload);
      notify('✅ Sitio creado');
    }
    limpiarForm();
    onClose();
    cargarDatos();
  };

  const abrirModalEditar = (s: any) => {
    if (!permisos.puedeEditar) return;
    setEditId(s.id);
    setNombre(s.nombre || '');
    setUbicacion(s.ubicacion || '');
    setEstado(s.estado === 'INACTIVO' ? 'INACTIVO' : 'ACTIVO');
    setIdArea(s.idArea?.id || '');
    setIdTipo(s.idTipoSitio?.id || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setNombre('');
    setUbicacion('');
    setEstado('ACTIVO');
    setIdArea('');
    setIdTipo('');
  };

  const filtered = useMemo(
    () =>
      filterValue
        ? sitios.filter((s) =>
            (
              `${s.nombre} ${s.ubicacion} ${s.idArea?.nombreArea || ''} ${
                s.idTipoSitio?.nombre || ''
              }`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : sitios,
    [sitios, filterValue]
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

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return (
          <span className="font-medium text-gray-800 break-words max-w-[16rem]">
            {item.nombre}
          </span>
        );
      case 'ubicacion':
        return <span className="text-sm text-gray-600">{item.ubicacion}</span>;
      case 'estado':
        return (
          <span
            className={`text-sm font-medium ${
              item.estado === 'ACTIVO' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.estado}
          </span>
        );
      case 'area':
        return (
          <span className="text-sm text-gray-600">
            {item.idArea?.nombreArea || '—'}
          </span>
        );
      case 'tipo':
        return (
          <span className="text-sm text-gray-600">
            {item.idTipoSitio?.nombre || '—'}
          </span>
        );
      case 'inventarios':
        return (
          <span className="text-sm text-gray-600">
            {item.inventarios?.length || 0}
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
          placeholder="Buscar por nombre, ubicación, área o tipo"
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
              Nuevo Sitio
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">Total {sitios.length} sitios</span>
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
            🏷️ Gestión de Sitios
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra bodegas, ambientes y otros sitios.
          </p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de sitios"
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
                  width={col.uid === 'nombre' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron sitios">
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
            <p className="text-center text-gray-500">No se encontraron sitios</p>
          )}
          {sorted.map((s) => (
            <Card key={s.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{s.nombre}</h3>
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
                  <span className="font-medium">Ubicación:</span> {s.ubicacion}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Estado:</span>{' '}
                  <span
                    className={s.estado === 'INACTIVO' ? 'text-red-600' : 'text-green-600'}
                  >
                    {s.estado}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Área:</span> {s.idArea?.nombreArea || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tipo:</span> {s.idTipoSitio?.nombre || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Inventarios:</span> {s.inventarios?.length || 0}
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
                <ModalHeader>{editId ? 'Editar Sitio' : 'Nuevo Sitio'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Ej: Bodega Norte"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    disabled={!permisos.puedeCrear && !editId}
                  />
                  <Input
                    label="Ubicación"
                    placeholder="Descripción de la ubicación"
                    value={ubicacion}
                    onValueChange={setUbicacion}
                    radius="sm"
                    disabled={!permisos.puedeCrear && !editId}
                  />
                  {/* Estado */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Estado
                    </label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value as 'ACTIVO' | 'INACTIVO')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!permisos.puedeCrear && !editId}
                    >
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </select>
                  </div>
                  {/* Área */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Área
                    </label>
                    <select
                      value={idArea}
                      onChange={(e) => setIdArea(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!permisos.puedeCrear && !editId}
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map((a: any) => (
                        <option key={a.id} value={a.id}>
                          {a.nombreArea}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Tipo sitio */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Tipo de Sitio
                    </label>
                    <select
                      value={idTipo}
                      onChange={(e) => setIdTipo(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!permisos.puedeCrear && !editId}
                    >
                      <option value="">Seleccione un tipo</option>
                      {tipos.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onCloseLocal}>
                    Cancelar
                  </Button>
                  <Button
                    variant="flat"
                    onPress={guardar}
                    isDisabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  >
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

export default SitiosPage;
