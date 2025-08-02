// src/pages/UsuariosPage.tsx
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
  ModalHeader,
  Checkbox,
  Select,
  SelectItem,
  useDisclosure,
  type SortDescriptor,
} from '@heroui/react';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '@/Api/Usuariosform';
import { getAreas, createArea } from '@/Api/AreasService';
import { getFichasFormacion, createFichaFormacion } from '@/Api/fichasFormacion';
import { getRoles, createRol } from '@/Api/RolService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { getDecodedTokenFromCookies } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombreCompleto', sortable: false },
  { name: 'Cédula', uid: 'cedula', sortable: false },
  { name: 'Email', uid: 'email', sortable: false },
  { name: 'Teléfono', uid: 'telefono', sortable: false },
  { name: 'Área', uid: 'area', sortable: false },
  { name: 'Ficha', uid: 'ficha', sortable: false },
  { name: 'Rol', uid: 'rol', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombreCompleto',
  'cedula',
  'email',
  'telefono',
  'area',
  'ficha',
  'rol',
  'actions',
];

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const {
    isOpen: userOpen,
    onOpen: openUser,
    onClose: closeUser,
    onOpenChange: onUserOpenChange,
  } = useDisclosure();

  const areaModal = useDisclosure();
  const fichaModal = useDisclosure();
  const rolModal = useDisclosure();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    password: '',
    idArea: '',
    idFicha: '',
    idRol: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [newAreaName, setNewAreaName] = useState('');
  const [newFichaName, setNewFichaName] = useState('');
  const [newRolName, setNewRolName] = useState('');

  // Estado permisos - agregado
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

        
        const url = `http://localhost:3000/permisos/por-ruta?ruta=/usuarios&idRol=${rolId}`;
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

  // Cargar datos solo si puedeVer
  const cargarDatos = async () => {
    if (!permisos.puedeVer) return;
    try {
      const [u, a, f, r] = await Promise.all([
        getUsuarios(),
        getAreas(),
        getFichasFormacion(),
        getRoles(),
      ]);
      setUsuarios(u);
      setAreas(a);
      setFichas(f);
      setRoles(r);
    } catch (err) {
      console.error('Error cargando datos', err);
      await MySwal.fire('Error', 'Error cargando datos', 'error');
    }
  };

  // Carga datos cuando cambia permiso puedeVer
  useEffect(() => {
    cargarDatos();
  }, [permisos]);

  // Función eliminar con permiso
  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para eliminar usuarios.', 'warning');
      return;
    }

    const result = await MySwal.fire({
      title: '¿Eliminar usuario?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteUsuario(id);
      await MySwal.fire('Eliminado', `Usuario ID ${id} eliminado`, 'success');
      await cargarDatos();
    } catch {
      await MySwal.fire('Error', 'Error eliminando usuario', 'error');
    }
  };

  // Función guardar (crear o editar) con validación permisos
  const guardar = async () => {
    if (!form.nombre.trim()) {
      await MySwal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }
    if (!form.idArea || !form.idFicha || !form.idRol) {
      await MySwal.fire('Atención', 'Debes seleccionar Área, Ficha y Rol', 'warning');
      return;
    }
    if (!editId && !form.password.trim()) {
      await MySwal.fire('Atención', 'La contraseña es obligatoria para crear usuario', 'warning');
      return;
    }
    if (editId && !permisos.puedeEditar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para editar usuarios.', 'warning');
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para crear usuarios.', 'warning');
      return;
    }

    const areaObj = areas.find(a => String(a.id) === form.idArea);
    const fichaObj = fichas.find(f => String(f.id) === form.idFicha);
    const rolObj = roles.find(r => String(r.id) === form.idRol);

    if (!areaObj || !fichaObj || !rolObj) {
      await MySwal.fire('Error', 'Selección inválida de Área, Ficha o Rol', 'error');
      return;
    }

    const payload: any = {
      nombre: form.nombre,
      apellido: form.apellido || null,
      cedula: form.cedula || null,
      email: form.email || null,
      telefono: form.telefono || null,
      idArea: areaObj,
      idFichaFormacion: fichaObj,
      rol: rolObj,
    };

    if (!editId) {
      payload.password = form.password;
    }

    try {
      if (editId) {
        await updateUsuario(editId, payload);
        await MySwal.fire('Éxito', 'Usuario actualizado', 'success');
      } else {
        await createUsuario(payload);
        await MySwal.fire('Éxito', 'Usuario creado', 'success');
      }
      closeUser();
      setForm({
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        password: '',
        idArea: '',
        idFicha: '',
        idRol: '',
      });
      setEditId(null);
      await cargarDatos();
    } catch (error: any) {
      console.error('Error guardando usuario:', error.response || error.message);
      await MySwal.fire(
        'Error',
        error.response?.data?.message || error.message || 'Error del servidor',
        'error',
      );
    }
  };

  const abrirModalEditar = (u: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para editar usuarios.', 'warning');
      return;
    }
    setEditId(u.id);
    setForm({
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      cedula: u.cedula || '',
      email: u.email || '',
      telefono: u.telefono || '',
      password: '',
      idArea: u.idArea?.id?.toString() || '',
      idFicha: u.idFichaFormacion?.id?.toString() || '',
      idRol: u.rol?.id?.toString() || '',
    });
    openUser();
  };

  // Solo abrir modal nuevo si puedeCrear
  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para crear usuarios.', 'warning');
      return;
    }
    setEditId(null);
    setForm({
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      password: '',
      idArea: '',
      idFicha: '',
      idRol: '',
    });
    openUser();
  };

  const filtered = useMemo(() => {
    if (!filterValue) return usuarios;
    return usuarios.filter(u =>
      `${u.nombre} ${u.apellido ?? ''} ${u.cedula ?? ''} ${u.email ?? ''}`
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
    );
  }, [usuarios, filterValue]);

  const pages = Math.max(Math.ceil(filtered.length / rowsPerPage), 1);

  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;
    items.sort((a, b) => {
      const x = a[column];
      const y = b[column];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  // Renderizado condicional de las opciones del Dropdown según permisos
  const renderDropdownItems = (item: any) => {
    const items = [];
    if (permisos.puedeEditar) {
      items.push(
        <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
          Editar
        </DropdownItem>,
      );
    }
    if (permisos.puedeEliminar) {
      items.push(
        <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)} className="text-danger">
          Eliminar
        </DropdownItem>,
      );
    }
    if (items.length === 0) {
      items.push(
        <DropdownItem key={`sin-acciones-${item.id}`} isDisabled>
          Sin acciones disponibles
        </DropdownItem>,
      );
    }
    return items;
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'nombreCompleto':
        return (
          <span className="font-medium text-gray-800 break-words max-w-[16rem]">
            {item.nombre} {item.apellido ?? ''}
          </span>
        );
      case 'area':
        return <span className="text-sm text-gray-600">{item.idArea?.nombreArea ?? '—'}</span>;
      case 'ficha':
        return (
          <span className="text-sm text-gray-600">
            {item.idFichaFormacion?.nombre ?? '—'}
          </span>
        );
      case 'rol':
        return <span className="text-sm text-gray-600">{item.rol?.nombreRol ?? '—'}</span>;
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="rounded-full text-[#0D1324]"
                aria-label="Acciones"
              >
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>{renderDropdownItems(item)}</DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item] ?? '—';
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const copy = new Set(prev);
      if (copy.has(key)) {
        // Prevenir ocultar columna 'actions' para mantener acceso a acciones
        if (key === 'actions') return copy;
        copy.delete(key);
      } else {
        copy.add(key);
      }
      return copy;
    });
  };

  // Controles para crear nueva área, ficha o rol permanecen iguales

  const guardarArea = async () => {
    if (!newAreaName.trim()) {
      await MySwal.fire('Atención', 'El nombre del área es obligatorio', 'warning');
      return;
    }
    try {
      await createArea({ nombreArea: newAreaName.trim() });
      await MySwal.fire('Éxito', 'Área creada', 'success');
      setNewAreaName('');
      areaModal.onClose();
      cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error creando área', 'error');
    }
  };

  const guardarFicha = async () => {
    if (!newFichaName.trim()) {
      await MySwal.fire('Atención', 'El nombre de la ficha es obligatorio', 'warning');
      return;
    }
    try {
      await createFichaFormacion({ nombre: newFichaName.trim() });
      await MySwal.fire('Éxito', 'Ficha creada', 'success');
      setNewFichaName('');
      fichaModal.onClose();
      cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error creando ficha', 'error');
    }
  };

  const guardarRol = async () => {
    if (!newRolName.trim()) {
      await MySwal.fire('Atención', 'El nombre del rol es obligatorio', 'warning');
      return;
    }
    try {
      await createRol({ nombreRol: newRolName.trim() });
      await MySwal.fire('Éxito', 'Rol creado', 'success');
      setNewRolName('');
      rolModal.onClose();
      cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error creando rol', 'error');
    }
  };

  // Si no tiene permiso puedeVer, mostrar mensaje y no renderizar tabla ni modales
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
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">👥 Gestión de Usuarios</h1>
          <p className="text-sm text-gray-600">Consulta y administra los usuarios registrados.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de usuarios"
            isHeaderSticky
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por nombre, cédula o email"
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
                          .filter(c => c.uid !== 'actions')
                          .map(col => (
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
                        Nuevo Usuario
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {usuarios.length} usuarios</span>
                  <label className="flex items-center text-default-400 text-sm">
                    Filas por página:&nbsp;
                    <select
                      className="bg-transparent outline-none text-default-600 ml-1"
                      value={rowsPerPage}
                      onChange={e => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(1);
                      }}
                    >
                      {[5, 10, 15].map(n => (
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
            <TableHeader columns={columns.filter(c => visibleColumns.has(c.uid))}>
              {col => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                  width={col.uid === 'nombreCompleto' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron usuarios">
              {item => (
                <TableRow key={item.id}>
                  {col => <TableCell>{renderCell(item, String(col))}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal Usuario */}
        <Modal
          isOpen={userOpen}
          onOpenChange={onUserOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable={false}
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-3xl w-full p-8">
            {(onCloseLocal) => (
              <>
                <ModalHeader className="mb-4 text-xl font-semibold text-[#0D1324]">
                  {editId ? 'Editar Usuario' : 'Nuevo Usuario'}
                </ModalHeader>
                <ModalBody>
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                    onSubmit={e => {
                      e.preventDefault();
                      guardar();
                    }}
                  >
                    <Input
                      label="Nombre"
                      value={form.nombre}
                      onValueChange={v => setForm(p => ({ ...p, nombre: v }))}
                      radius="sm"
                      required
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                    <Input
                      label="Apellido"
                      value={form.apellido}
                      onValueChange={v => setForm(p => ({ ...p, apellido: v }))}
                      radius="sm"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                    <Input
                      label="Cédula"
                      value={form.cedula}
                      onValueChange={v => setForm(p => ({ ...p, cedula: v }))}
                      radius="sm"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onValueChange={v => setForm(p => ({ ...p, email: v }))}
                      radius="sm"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                    <Input
                      label="Teléfono"
                      value={form.telefono}
                      onValueChange={v => setForm(p => ({ ...p, telefono: v }))}
                      radius="sm"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                    {!editId && (
                      <Input
                        label="Contraseña"
                        type="password"
                        value={form.password}
                        onValueChange={v => setForm(p => ({ ...p, password: v }))}
                        radius="sm"
                        required
                        disabled={!permisos.puedeCrear}
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <Select
                        label="Área"
                        selectedKeys={form.idArea ? new Set([form.idArea]) : new Set()}
                        onSelectionChange={k => setForm(p => ({ ...p, idArea: String(Array.from(k)[0]) }))}
                        radius="sm"
                        className="flex-grow"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        {areas.map(a => (
                          <SelectItem key={String(a.id)}>{a.nombreArea}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        variant="solid"
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white"
                        onPress={areaModal.onOpen}
                        aria-label="Agregar Área"
                        title="Agregar Área"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        <PlusIcon size={18} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        label="Ficha de Formación"
                        selectedKeys={form.idFicha ? new Set([form.idFicha]) : new Set()}
                        onSelectionChange={k => setForm(p => ({ ...p, idFicha: String(Array.from(k)[0]) }))}
                        radius="sm"
                        className="flex-grow"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        {fichas.map(f => (
                          <SelectItem key={String(f.id)}>{f.nombre}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        variant="solid"
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white"
                        onPress={fichaModal.onOpen}
                        aria-label="Agregar Ficha de Formación"
                        title="Agregar Ficha de Formación"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        <PlusIcon size={18} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        label="Rol"
                        selectedKeys={form.idRol ? new Set([form.idRol]) : new Set()}
                        onSelectionChange={k => setForm(p => ({ ...p, idRol: String(Array.from(k)[0]) }))}
                        radius="sm"
                        className="flex-grow"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        {roles.map(r => (
                          <SelectItem key={String(r.id)}>{r.nombreRol}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        variant="solid"
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white"
                        onPress={rolModal.onOpen}
                        aria-label="Agregar Rol"
                        title="Agregar Rol"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        <PlusIcon size={18} />
                      </Button>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <Button variant="light" onClick={onCloseLocal} type="button">
                        Cancelar
                      </Button>
                      <Button
                        variant="flat"
                        type="submit"
                        disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      >
                        {editId ? 'Actualizar' : 'Crear'}
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modales para Área, Ficha y Rol sin cambios, solo agregar disabled si quieres */}
        <Modal
          isOpen={areaModal.isOpen}
          onOpenChange={areaModal.onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-md p-6">
            <>
              <ModalHeader>Nueva Área</ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre del área"
                  value={newAreaName}
                  onValueChange={setNewAreaName}
                  radius="sm"
                  autoFocus
                />
              </ModalBody>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="light" onPress={areaModal.onClose}>
                  Cancelar
                </Button>
                <Button variant="flat" onPress={guardarArea}>
                  Crear
                </Button>
              </div>
            </>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={fichaModal.isOpen}
          onOpenChange={fichaModal.onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-md p-6">
            <>
              <ModalHeader>Nueva Ficha de Formación</ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre de la ficha"
                  value={newFichaName}
                  onValueChange={setNewFichaName}
                  radius="sm"
                  autoFocus
                />
              </ModalBody>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="light" onPress={fichaModal.onClose}>
                  Cancelar
                </Button>
                <Button variant="flat" onPress={guardarFicha}>
                  Crear
                </Button>
              </div>
            </>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={rolModal.isOpen}
          onOpenChange={rolModal.onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-md p-6">
            <>
              <ModalHeader>Nuevo Rol</ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre del rol"
                  value={newRolName}
                  onValueChange={setNewRolName}
                  radius="sm"
                  autoFocus
                />
              </ModalBody>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="light" onPress={rolModal.onClose}>
                  Cancelar
                </Button>
                <Button variant="flat" onPress={guardarRol}>
                  Crear
                </Button>
              </div>
            </>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UsuariosPage;
