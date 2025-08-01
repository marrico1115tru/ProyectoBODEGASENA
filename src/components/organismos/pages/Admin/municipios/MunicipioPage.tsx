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
  obtenerMunicipios,
  crearMunicipio,
  actualizarMunicipio,
  eliminarMunicipio,
} from '@/Api/MunicipiosForm';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import axios from 'axios';
import { getDecodedTokenFromCookies } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: 'Departamento', uid: 'departamento', sortable: false },
  { name: 'Centros', uid: 'centros', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = ['id', 'nombre', 'departamento', 'centros', 'actions'];

const MunicipiosPage = () => {
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  // Estado permisos
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  // Cargar permisos al montar
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/MunicipioPage&idRol=${rolId}`;
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
        console.error("Error al obtener permisos:", error);
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

  // Cargar municipios solo si tiene permiso de ver
  const cargarMunicipios = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await obtenerMunicipios();
      setMunicipios(data);
    } catch (err) {
      console.error('Error cargando municipios', err);
      await MySwal.fire('Error', 'No se pudo cargar los municipios', 'error');
    }
  };

  useEffect(() => {
    cargarMunicipios();
  }, [permisos]);

  // Eliminar con validación de permiso
  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para eliminar municipios.", "warning");
      return;
    }
    const result = await MySwal.fire({
      title: '¿Eliminar municipio?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await eliminarMunicipio(id);
      await MySwal.fire('Eliminado', `Municipio eliminado: ID ${id}`, 'success');
      await cargarMunicipios();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'No se pudo eliminar el municipio', 'error');
    }
  };

  // Guardar con validación de permisos
  const guardar = async () => {
    if (!nombre.trim()) {
      await MySwal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }
    if (!departamento.trim()) {
      await MySwal.fire('Error', 'El departamento es obligatorio', 'error');
      return;
    }
    if (editId && !permisos.puedeEditar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para editar municipios.", "warning");
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para crear municipios.", "warning");
      return;
    }
    const payload = { nombre: nombre.trim(), departamento: departamento.trim() };

    try {
      if (editId) {
        await actualizarMunicipio(editId, payload);
        await MySwal.fire('Actualizado', 'Municipio actualizado', 'success');
      } else {
        await crearMunicipio(payload);
        await MySwal.fire('Creado', 'Municipio creado', 'success');
      }
      limpiarForm();
      onClose();
      await cargarMunicipios();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error guardando municipio', 'error');
    }
  };

  // Abrir modal edición con validación
  const abrirModalEditar = (m: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para editar municipios.", "warning");
      return;
    }
    setEditId(m.id);
    setNombre(m.nombre || '');
    setDepartamento(m.departamento || '');
    onOpen();
  };

  // Abrir modal nuevo con validación
  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para crear municipios.", "warning");
      return;
    }
    limpiarForm();
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setNombre('');
    setDepartamento('');
  };

  const filtered = useMemo(() => {
    if (!filterValue) return municipios;
    return municipios.filter((m) =>
      `${m.nombre} ${m.departamento}`.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [municipios, filterValue]);

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
          <span className="font-medium text-gray-800 capitalize break-words max-w-[16rem]">
            {item.nombre}
          </span>
        );
      case 'departamento':
        return <span className="text-sm text-gray-600">{item.departamento}</span>;
      case 'centros':
        return <span className="text-sm text-gray-600">{item.centroFormacions?.length || 0}</span>;
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
            <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)}>
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

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          className="w-full md:max-w-[44%]"
          radius="lg"
          placeholder="Buscar por nombre o departamento"
          startContent={<SearchIcon className="text-[#0D1324]" />}
          value={filterValue}
          onValueChange={setFilterValue}
          onClear={() => setFilterValue('')}
          disabled={!permisos.puedeVer}
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
              onPress={abrirModalNuevo}
            >
              Nuevo Municipio
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">Total {municipios.length} municipios</span>
        <label className="flex items-center text-default-400 text-sm">
          Filas por página:&nbsp;
          <select
            className="bg-transparent outline-none text-default-600 ml-1"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            disabled={!permisos.puedeVer}
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
      <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)} disabled={!permisos.puedeVer}>
        Anterior
      </Button>
      <Pagination isCompact showControls page={page} total={pages} onChange={setPage} isDisabled={!permisos.puedeVer} />
      <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)} disabled={!permisos.puedeVer}>
        Siguiente
      </Button>
    </div>
  );

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  const renderMobileDropdownItems = (m: any) => {
    const items = [];
    
    if (permisos.puedeEditar) {
      items.push(
        <DropdownItem key={`editar-${m.id}`} onPress={() => abrirModalEditar(m)}>
          Editar
        </DropdownItem>
      );
    }
    
    if (permisos.puedeEliminar) {
      items.push(
        <DropdownItem key={`eliminar-${m.id}`} onPress={() => eliminar(m.id)}>
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

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">🗺️ Gestión de Municipios</h1>
          <p className="text-sm text-gray-600">Consulta y administra los municipios registrados.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de municipios"
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
                <TableColumn key={col.uid} align={col.uid === 'actions' ? 'center' : 'start'}>
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron municipios">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, String(col))}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Vista móvil */}
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron municipios</p>
          ) : (
            sorted.map((m) => (
              <div key={m.id} className="shadow-sm rounded-xl bg-white p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{m.nombre}</h3>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                        <MoreVertical />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {renderMobileDropdownItems(m)}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Depto:</span> {m.departamento}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Centros:</span> {m.centroFormacions?.length || 0}
                </p>
                <p className="text-xs text-gray-400">ID: {m.id}</p>
              </div>
            ))
          )}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30" isDismissable>
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? 'Editar Municipio' : 'Nuevo Municipio'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Ej: Neiva"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    autoFocus
                  />
                  <Input
                    label="Departamento"
                    placeholder="Ej: Huila"
                    value={departamento}
                    onValueChange={setDepartamento}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="light" onPress={onClose}>
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

export default MunicipiosPage;