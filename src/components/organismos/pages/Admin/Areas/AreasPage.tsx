import { useEffect, useState, useMemo } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger,
  Pagination, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Checkbox, useDisclosure, type SortDescriptor
} from '@heroui/react';
import { getAreas, createArea, updateArea, deleteArea } from '@/Api/AreasService';
import { getSedes } from '@/Api/SedesService';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService'; // Ajusta la ruta si es necesario
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Cambia esto según cómo obtengas el rol actual
const ID_ROL_ACTUAL = 1;

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre del Área', uid: 'nombreArea', sortable: false },
  { name: 'Sede', uid: 'sede', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = ['id', 'nombreArea', 'sede', 'actions'];

const AreasPage = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' });
  const [nombreArea, setNombreArea] = useState('');
  const [idSede, setIdSede] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    try {
      const p = await getPermisosPorRuta('/AreasPage', ID_ROL_ACTUAL);
      setPermisos(p);
      if (p.puedeVer) {
        cargarAreas();
        cargarSedes();
      }
    } catch (err) {
      console.error('Error cargando permisos', err);
    }
  };

  const cargarAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (err) {
      console.error('Error cargando áreas', err);
    }
  };

  const cargarSedes = async () => {
    try {
      const data = await getSedes();
      setSedes(data);
    } catch (err) {
      console.error('Error cargando sedes', err);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar área? No se podrá recuperar.')) return;
    await deleteArea(id);
    cargarAreas();
    notify(`🗑️ Área eliminada: ID ${id}`);
  };

  const guardar = async () => {
    const payload = { nombreArea, idSede: idSede ? { id: parseInt(idSede) } : null };
    editId ? await updateArea(editId, payload) : await createArea(payload);
    cargarAreas();
    onClose();
    setNombreArea('');
    setIdSede('');
    setEditId(null);
    notify(editId ? '✏️ Área actualizada' : '✅ Área creada');
  };

  const abrirModalEditar = (area: any) => {
    setEditId(area.id);
    setNombreArea(area.nombreArea);
    setIdSede(area.idSede?.id?.toString() || '');
    onOpen();
  };

  const filtered = useMemo(() => (
    filterValue
      ? areas.filter(a =>
          a.nombreArea.toLowerCase().includes(filterValue.toLowerCase()) ||
          a.idSede?.nombre?.toLowerCase().includes(filterValue.toLowerCase()))
      : areas
  ), [areas, filterValue]);

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
    if (columnKey === 'nombreArea')
      return <span className="font-medium text-gray-800 capitalize break-words max-w-[14rem]">{item.nombreArea}</span>;
    if (columnKey === 'sede')
      return <span className="text-sm text-gray-500 break-words max-w-[12rem]">{item.idSede?.nombre || 'N/A'}</span>;
    if (columnKey === 'actions') {
      if (!permisos.puedeEditar && !permisos.puedeEliminar) return null;
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
              <MoreVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {permisos.puedeEditar ? (
              <DropdownItem onPress={() => abrirModalEditar(item)} key="editar">Editar</DropdownItem>
            ) : null}
            {permisos.puedeEliminar ? (
              <DropdownItem onPress={() => eliminar(item.id)} key="eliminar">Eliminar</DropdownItem>
            ) : null}
          </DropdownMenu>
        </Dropdown>
      );
    }
    return item[columnKey as keyof typeof item];
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
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

  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📌 Gestión de Áreas Formativas
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra las áreas disponibles y su sede asignada.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de áreas"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              th: 'py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm',
              td: 'align-middle py-3 px-4',
            }}
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por nombre de área o sede"
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
                      <DropdownMenu>
                        {columns.filter(c => c.uid !== 'actions').map(col => (
                          <DropdownItem key={col.uid} onPress={() => toggleColumn(col.uid)}>
                            <Checkbox isSelected={visibleColumns.has(col.uid)} readOnly />
                            {col.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    {permisos.puedeCrear ? (
                      <Button
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                        endContent={<PlusIcon />}
                        onPress={onOpen}
                      >
                        Nueva Área
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {areas.length} áreas</span>
                  <label className="flex items-center text-default-400 text-sm">
                    Filas por página:&nbsp;
                    <select
                      className="bg-transparent outline-none text-default-600 ml-1"
                      value={rowsPerPage}
                      onChange={e => {
                        setRowsPerPage(parseInt(e.target.value));
                        setPage(1);
                      }}
                    >
                      {[5, 10, 15].map(n => <option key={n}>{n}</option>)}
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
          >
            <TableHeader columns={columns.filter(c => visibleColumns.has(c.uid))}>
              {col => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                  width={col.uid === 'nombreArea' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron áreas">
              {item => (
                <TableRow key={item.id}>
                  {col => <TableCell>{renderCell(item, col as string)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards móviles */}
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && <p className="text-center text-gray-500">No se encontraron áreas</p>}
          {sorted.map(area => (
            <Card key={area.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg break-words max-w-[14rem]">{area.nombreArea}</h3>
                  {(permisos.puedeEditar || permisos.puedeEliminar) ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                          <MoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {permisos.puedeEditar ? (
                          <DropdownItem onPress={() => abrirModalEditar(area)} key="editar">Editar</DropdownItem>
                        ) : null}
                        {permisos.puedeEliminar ? (
                          <DropdownItem onPress={() => eliminar(area.id)} key="eliminar">Eliminar</DropdownItem>
                        ) : null}
                      </DropdownMenu>
                    </Dropdown>
                  ) : null}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Sede: </span>{area.idSede?.nombre || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">ID: {area.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30">
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {onCloseLocal => (
              <>
                <ModalHeader>{editId ? 'Editar Área' : 'Nueva Área'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre del Área"
                    placeholder="Escribe el nombre"
                    value={nombreArea}
                    onValueChange={setNombreArea}
                    radius="sm"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Sede</label>
                    <select
                      value={idSede}
                      onChange={e => setIdSede(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una sede</option>
                      {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
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

export default AreasPage;