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
  getTiposSitio,
  createTipoSitio,
  updateTipoSitio,
  deleteTipoSitio,
} from '@/Api/Tipo_sitios';
import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ID_ROL_ACTUAL = 1; // Ajusta según entorno

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: '# Sitios', uid: 'sitios', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = ['id', 'nombre', 'sitios', 'actions'];

const TipoSitiosPage = () => {
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const [tipos, setTipos] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    (async () => {
      try {
        const p = await getPermisosPorRuta('/Tipo_sitiosPage', ID_ROL_ACTUAL);
        setPermisos(p);
        if (p.puedeVer) await cargarDatos();
      } catch {
        setPermisos({ puedeVer: false, puedeCrear: false, puedeEditar: false, puedeEliminar: false });
      }
    })();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getTiposSitio();
      setTipos(data);
    } catch {
      await MySwal.fire('Error', 'No se pudieron cargar los tipos de sitio', 'error');
    }
  };

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) return;

    const result = await MySwal.fire({
      icon: 'warning',
      title: '¿Eliminar tipo de sitio?',
      text: 'No se podrá recuperar.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTipoSitio(id);
      await MySwal.fire('Eliminado', `Tipo eliminado: ID ${id}`, 'success');
      await cargarDatos();
    } catch {
      await MySwal.fire('Error', 'No se pudo eliminar el tipo de sitio', 'error');
    }
  };

  const guardar = async () => {
    if (editId && !permisos.puedeEditar) return;
    if (!editId && !permisos.puedeCrear) return;

    if (!nombre.trim()) {
      await MySwal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    const payload = { nombre };

    try {
      if (editId) {
        await updateTipoSitio(editId, payload);
        await MySwal.fire('Actualizado', 'Tipo actualizado', 'success');
      } else {
        await createTipoSitio(payload);
        await MySwal.fire('Creado', 'Tipo creado', 'success');
      }
      limpiarForm();
      onClose();
      await cargarDatos();
    } catch {
      await MySwal.fire('Error', 'Error guardando el tipo de sitio', 'error');
    }
  };

  const abrirModalEditar = (t: any) => {
    if (!permisos.puedeEditar) return;
    setEditId(t.id);
    setNombre(t.nombre || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setNombre('');
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

  const filtered = useMemo(() => {
    if (!filterValue) return tipos;
    return tipos.filter(t => (`${t.id} ${t.nombre}`).toLowerCase().includes(filterValue.toLowerCase()));
  }, [tipos, filterValue]);

  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

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

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return <span className="font-medium text-gray-800 break-words max-w-[16rem]">{item.nombre}</span>;
      case 'sitios':
        return <span className="text-sm text-gray-600">{item.sitios?.length || 0}</span>;
      case 'actions':
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
                <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
                  Editar
                </DropdownItem>
              ) : null}
              {permisos.puedeEliminar ? (
                <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)}>
                  Eliminar
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">🏷️ Gestión de Tipos de Sitio</h1>
          <p className="text-sm text-gray-600">Consulta y administra los tipos de sitio registrados.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de tipos de sitio"
            isHeaderSticky
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por nombre o ID"
                    startContent={<SearchIcon className="text-[#0D1324]" />}
                    value={filterValue}
                    onValueChange={setFilterValue}
                    onClear={() => setFilterValue('')}
                  />
                  <div className="flex gap-3">
                    {permisos.puedeCrear && (
                      <Button
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                        endContent={<PlusIcon />}
                        onPress={() => {
                          limpiarForm();
                          onOpen();
                        }}
                      >
                        Nuevo Tipo
                      </Button>
                    )}
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
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {tipos.length} tipos</span>
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
            }
            bottomContent={
              <div className="py-2 px-2 flex justify-center items-center gap-2">
                <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Pagination isCompact showControls page={page} total={pages} onChange={setPage} />
                <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>
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
                  width={col.uid === 'nombre' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron tipos de sitio">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as string)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron tipos de sitio</p>
          ) : (
            sorted.map((t) => (
              <Card key={t.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{t.nombre}</h3>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                            <MoreVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          {permisos.puedeEditar ? (
                            <DropdownItem key={`editar-${t.id}`} onPress={() => abrirModalEditar(t)}>
                              Editar
                            </DropdownItem>
                          ) : null}
                          {permisos.puedeEliminar ? (
                            <DropdownItem key={`eliminar-${t.id}`} onPress={() => eliminar(t.id)}>
                              Eliminar
                            </DropdownItem>
                          ) : null}
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sitios:</span> {t.sitios?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">ID: {t.id}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30">
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            <>
              <ModalHeader>{editId ? 'Editar Tipo' : 'Nuevo Tipo'}</ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Nombre"
                  placeholder="Ej: Bodega Central"
                  value={nombre}
                  onValueChange={setNombre}
                  radius="sm"
                  disabled={!permisos.puedeCrear && !editId}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button variant="flat" onPress={guardar} isDisabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}>
                  {editId ? 'Actualizar' : 'Crear'}
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default TipoSitiosPage;
