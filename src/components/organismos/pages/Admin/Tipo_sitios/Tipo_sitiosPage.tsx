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
import DefaultLayout from '@/layouts/default';
import {
  PlusIcon,
  MoreVertical,
  Search,
  Pencil,
  Trash,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import axiosInstance from '@/Api/axios'; 
import { getDecodedTokenFromCookies } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: '# Sitios', uid: 'sitios', sortable: false },
  { name: 'Acciones', uid: 'actions' },
] as const;

const INITIAL_VISIBLE_COLUMNS = ['id', 'nombre', 'sitios', 'actions'] as const;
type ColumnKey = (typeof columns)[number]['uid'];

const TipoSitiosPage = () => {
  const [tipos, setTipos] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const toggleColumn = (uid: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        if (uid === 'actions') return prev;
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `/permisos/por-ruta?ruta=/tipo-sitio&idRol=${rolId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });

        const permisosData = response.data.data;
        if (permisosData) {
          setPermisos({
            puedeVer: Boolean(permisosData.puedeVer),
            puedeCrear: Boolean(permisosData.puedeCrear),
            puedeEditar: Boolean(permisosData.puedeEditar),
            puedeEliminar: Boolean(permisosData.puedeEliminar),
          });
        } else {
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
        setPermisos({
          puedeVer: false,
          puedeCrear: false,
          puedeEditar: false,
          puedeEliminar: false,
        });
      }
    };
    fetchPermisos();
  }, []);

  const cargarTiposSitio = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await getTiposSitio();
      setTipos(data);
    } catch (error) {
      console.error('Error al cargar tipos de sitio:', error);
      await MySwal.fire('Error', 'Error al cargar tipos de sitio', 'error');
    }
  };

  useEffect(() => {
    cargarTiposSitio();
  }, [permisos]);

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para eliminar tipos de sitio.', 'warning');
      return;
    }
    const result = await MySwal.fire({
      title: '¿Eliminar tipo de sitio?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteTipoSitio(id);
      await MySwal.fire('Eliminado', `Tipo de sitio eliminado: ID ${id}`, 'success');
      await cargarTiposSitio();
    } catch (error) {
      console.error('Error al eliminar tipo de sitio:', error);
      await MySwal.fire('Error', 'Error al eliminar tipo de sitio', 'error');
    }
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      await MySwal.fire('Aviso', 'El nombre es obligatorio', 'info');
      return;
    }
    if (editId && !permisos.puedeEditar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para editar tipos de sitio.', 'warning');
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para crear tipos de sitio.', 'warning');
      return;
    }

    const payload = { nombre: nombre.trim() };

    try {
      if (editId) {
        await updateTipoSitio(editId, payload);
        await MySwal.fire('Éxito', 'Tipo de sitio actualizado', 'success');
      } else {
        await createTipoSitio(payload);
        await MySwal.fire('Éxito', 'Tipo de sitio creado', 'success');
      }
      cerrarModal();
      await cargarTiposSitio();
    } catch (error) {
      console.error('Error al guardar tipo de sitio:', error);
      await MySwal.fire('Error', 'Error al guardar tipo de sitio', 'error');
    }
  };

  const abrirModalEditar = (tipo: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para editar tipos de sitio.', 'warning');
      return;
    }
    setEditId(tipo.id);
    setNombre(tipo.nombre);
    onOpen();
  };

  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para crear tipos de sitio.', 'warning');
      return;
    }
    setEditId(null);
    setNombre('');
    onOpen();
  };

  const cerrarModal = () => {
    setEditId(null);
    setNombre('');
    onClose();
  };

  const filtered = useMemo(() => {
    return filterValue
      ? tipos.filter((t) => (t.nombre || '').toLowerCase().includes(filterValue.toLowerCase()))
      : tipos;
  }, [tipos, filterValue]);

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

  const renderMobileDropdownItems = (item: any) => {
    const items = [];
    if (permisos.puedeEditar) {
      items.push(
        <DropdownItem
          key={`editar-mobile-${item.id}`}
          onPress={() => abrirModalEditar(item)}
          startContent={<Pencil size={16} />}
        >
          Editar
        </DropdownItem>
      );
    }
    if (permisos.puedeEliminar) {
      items.push(
        <DropdownItem
          key={`eliminar-mobile-${item.id}`}
          onPress={() => eliminar(item.id)}
          startContent={<Trash size={16} />}
          className="text-danger"
        >
          Eliminar
        </DropdownItem>
      );
    }
    if (items.length === 0) {
      items.push(
        <DropdownItem key={`sin-acciones-mobile-${item.id}`} isDisabled>
          Sin acciones disponibles
        </DropdownItem>
      );
    }
    return items;
  };

  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'nombre':
        return <span className="font-medium text-gray-800">{item.nombre || '—'}</span>;
      case 'sitios':
        return <span className="text-sm text-gray-600">{item.sitios?.length || 0}</span>;
      case 'actions':
        const dropdownItems = [];
        if (permisos.puedeEditar) {
          dropdownItems.push(
            <DropdownItem
              key={`editar-${item.id}`}
              onPress={() => abrirModalEditar(item)}
              startContent={<Pencil size={16} />}
            >
              Editar
            </DropdownItem>
          );
        }
        if (permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem
              key={`eliminar-${item.id}`}
              onPress={() => eliminar(item.id)}
              startContent={<Trash size={16} />}
              className="text-danger"
            >
              Eliminar
            </DropdownItem>
          );
        }
        if (dropdownItems.length === 0) {
          dropdownItems.push(
            <DropdownItem key={`sin-acciones-${item.id}`} isDisabled>
              Sin acciones disponibles
            </DropdownItem>
          );
        }
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>{dropdownItems}</DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item] || '—';
    }
  };

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            <span>Gestión de Tipos de Sitio</span>
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra los tipos de sitio disponibles.
          </p>
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
                    placeholder="Buscar por nombre"
                    startContent={<Search className="text-[#0D1324]" />}
                    value={filterValue}
                    onValueChange={setFilterValue}
                    onClear={() => setFilterValue('')}
                  />
                  <div className="flex gap-3 items-center">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat">Columnas</Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Seleccionar columnas">
                        {columns
                          .filter((c) => c.uid !== 'actions')
                          .map((col) => (
                            <DropdownItem key={col.uid} className="flex items-center gap-2">
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
                        endContent={<PlusIcon size={18} />}
                        onPress={abrirModalNuevo}
                      >
                        Nuevo Tipo
                      </Button>
                    )}
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
                  width={col.uid === 'nombre' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={sorted} emptyContent="No se encontraron tipos de sitio">
              {(item) => (
                <TableRow key={item.id}>{(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}</TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron tipos de sitio</p>
          )}
          {sorted.map((t) => (
            <Card key={t.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{t.nombre}</h3>
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
                        {renderMobileDropdownItems(t)}
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
          ))}
        </div>

        {permisos.puedeCrear && (
          <div className="md:hidden fixed bottom-6 right-6">
            <Button
              isIconOnly
              className="bg-[#0D1324] hover:bg-[#1a2133] text-white rounded-full w-14 h-14 shadow-lg"
              onPress={abrirModalNuevo}
            >
              <PlusIcon size={24} />
            </Button>
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? 'Editar Tipo de Sitio' : 'Nuevo Tipo de Sitio'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del tipo de sitio"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    autoFocus
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="light" onPress={cerrarModal}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onPress={guardar}
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
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

export default TipoSitiosPage;
