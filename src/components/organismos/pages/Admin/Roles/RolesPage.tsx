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
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from '@/Api/RolService';

import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { getDecodedTokenFromCookies } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Rol', uid: 'rol', sortable: false },
  { name: 'Usuarios', uid: 'usuarios', sortable: false },
  { name: 'Permisos', uid: 'permisos', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = ['id', 'rol', 'usuarios', 'permisos', 'actions'] as const;

type ColumnKey = (typeof columns)[number]['uid'];

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [nombreRol, setNombreRol] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();


  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });


  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/roles&idRol=${rolId}`;
        const response = await axios.get(url, { withCredentials: true });

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

  const cargarRoles = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error('Error cargando roles', err);
      await MySwal.fire('Error', 'No se pudo cargar los roles', 'error');
    }
  };

  useEffect(() => {
    cargarRoles();
  }, [permisos]);

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para eliminar roles.', 'warning');
      return;
    }
    const result = await MySwal.fire({
      title: '¿Eliminar rol?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteRol(id);
      await MySwal.fire('Eliminado', `Rol eliminado: ID ${id}`, 'success');
      await cargarRoles();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'No se pudo eliminar el rol', 'error');
    }
  };

  const guardar = async () => {
    if (!nombreRol.trim()) {
      await MySwal.fire('Aviso', 'El nombre del rol es obligatorio', 'info');
      return;
    }
    if (editId && !permisos.puedeEditar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para editar roles.', 'warning');
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para crear roles.', 'warning');
      return;
    }

    const payload = { nombreRol: nombreRol.trim() };

    try {
      if (editId) {
        await updateRol(editId, payload);
        await MySwal.fire('Éxito', 'Rol actualizado', 'success');
      } else {
        await createRol(payload);
        await MySwal.fire('Éxito', 'Rol creado', 'success');
      }
      limpiarForm();
      onClose();
      await cargarRoles();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error guardando rol', 'error');
    }
  };

  const abrirModalEditar = (r: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para editar roles.', 'warning');
      return;
    }
    setEditId(r.id);
    setNombreRol(r.nombreRol);
    onOpen();
  };

  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para crear roles.', 'warning');
      return;
    }
    limpiarForm();
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setNombreRol('');
  };

  const filtered = useMemo(() => {
    if (!filterValue) return roles;
    return roles.filter((r) =>
      `${r.nombreRol}`.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [roles, filterValue]);

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

  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'rol':
        return (
          <span className="font-medium text-gray-800 break-words max-w-[18rem]">
            {item.nombreRol}
          </span>
        );
      case 'usuarios':
        return <span className="text-sm text-gray-600">{item.usuarios?.length || 0}</span>;
      case 'permisos':
        return <span className="text-sm text-gray-600">{item.permisos?.length || 0}</span>;
      case 'actions':
        const dropdownItems = [];
        if (permisos.puedeEditar) {
          dropdownItems.push(
            <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
              Editar
            </DropdownItem>
          );
        }
        if (permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)} className="text-danger">
              Eliminar
            </DropdownItem>
          );
        }
        if (!permisos.puedeEditar && !permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem key="sinAcciones" isDisabled>
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

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const copy = new Set(prev);
      if (copy.has(key)) {
        if (key === 'actions') return prev;
        copy.delete(key);
      } else {
        copy.add(key);
      }
      return copy;
    });
  };

  const renderMobileDropdownItems = (r: any) => {
    const items = [];
    if (permisos.puedeEditar) {
      items.push(
        <DropdownItem key={`editar-${r.id}`} onPress={() => abrirModalEditar(r)}>
          Editar
        </DropdownItem>
      );
    }
    if (permisos.puedeEliminar) {
      items.push(
        <DropdownItem key={`eliminar-${r.id}`} onPress={() => eliminar(r.id)}>
          Eliminar
        </DropdownItem>
      );
    }
    if (!permisos.puedeEditar && !permisos.puedeEliminar) {
      items.push(
        <DropdownItem key="sinAcciones" isDisabled>
          Sin acciones disponibles
        </DropdownItem>
      );
    }
    return items;
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

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          className="w-full md:max-w-[44%]"
          radius="lg"
          placeholder="Buscar por nombre de rol"
          startContent={<SearchIcon className="text-[#0D1324]" />}
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
                  <DropdownItem key={col.uid} className="py-1 px-2 flex items-center gap-2">
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
              onPress={abrirModalNuevo}
            >
              Nuevo Rol
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">Total {roles.length} roles</span>
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
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">🛡️ Gestión de Roles</h1>
          <p className="text-sm text-gray-600">Consulta y administra los roles y sus permisos.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de roles"
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
                  width={col.uid === 'rol' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron roles">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron roles</p>
          ) : (
            sorted.map((r) => (
              <Card key={r.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg break-words max-w-[14rem]">{r.nombreRol}</h3>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                          <MoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {renderMobileDropdownItems(r)}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Usuarios:</span> {r.usuarios?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Permisos:</span> {r.permisos?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">ID: {r.id}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
                <ModalHeader>{editId ? 'Editar Rol' : 'Nuevo Rol'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre del rol"
                    placeholder="Ej: Administrador"
                    value={nombreRol}
                    onValueChange={setNombreRol}
                    radius="sm"
                    autoFocus
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="light" onPress={() => { limpiarForm(); onClose(); }}>
                    Cancelar
                  </Button>
                  <Button
                    variant="flat"
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

export default RolesPage;