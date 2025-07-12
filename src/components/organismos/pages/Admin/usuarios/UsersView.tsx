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
import { getAreas } from '@/Api/AreasService';
import { getFichasFormacion } from '@/Api/fichasFormacion';
import { getRoles } from '@/Api/RolService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';

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

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

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

  // Control del modal con useDisclosure
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    cargo: '',
    password: '',
    idArea: '',
    idFicha: '',
    idRol: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
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
      notify('Error cargando datos');
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar usuario? No se podrá recuperar.')) return;
    try {
      await deleteUsuario(id);
      notify(`🗑️ Usuario eliminado: ID ${id}`);
      cargarDatos();
    } catch {
      notify('Error eliminando usuario');
    }
  };

  const guardar = async () => {
    if (!form.nombre.trim()) {
      notify('El nombre es obligatorio');
      return;
    }
    if (!form.idArea || !form.idFicha || !form.idRol) {
      notify('Debes seleccionar Área, Ficha y Rol');
      return;
    }
    if (!editId && !form.password.trim()) {
      notify('La contraseña es obligatoria para crear usuario');
      return;
    }

    const areaObj = areas.find(a => String(a.id) === form.idArea);
    const fichaObj = fichas.find(f => String(f.id) === form.idFicha);
    const rolObj = roles.find(r => String(r.id) === form.idRol);

    if (!areaObj || !fichaObj || !rolObj) {
      notify('Selección inválida de Área, Ficha o Rol');
      return;
    }

    const payload: any = {
      nombre: form.nombre,
      apellido: form.apellido || null,
      cedula: form.cedula || null,
      email: form.email || null,
      telefono: form.telefono || null,
      cargo: form.cargo || null,
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
        notify('✏️ Usuario actualizado');
      } else {
        await createUsuario(payload);
        notify('✅ Usuario creado');
      }
      onClose();
      setForm({
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        cargo: '',
        password: '',
        idArea: '',
        idFicha: '',
        idRol: '',
      });
      setEditId(null);
      cargarDatos();
    } catch (error: any) {
      console.error('Error guardando usuario:', error.response || error.message);
      notify(`❌ Error: ${error.response?.data?.message || error.message || 'Servidor'}`);
    }
  };

  const abrirModalEditar = (u: any) => {
    setEditId(u.id);
    setForm({
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      cedula: u.cedula || '',
      email: u.email || '',
      telefono: u.telefono || '',
      cargo: u.cargo || '',
      password: '',
      idArea: u.idArea?.id?.toString() || '',
      idFicha: u.idFichaFormacion?.id?.toString() || '',
      idRol: u.rol?.id?.toString() || '',
    });
    onOpen();
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
              >
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
                Editar
              </DropdownItem>
              <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)}>
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item] ?? '—';
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const copy = new Set(prev);
      if (copy.has(key)) copy.delete(key);
      else copy.add(key);
      return copy;
    });
  };

  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            👥 Gestión de Usuarios
          </h1>
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
                    <Button
                      className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                      endContent={<PlusIcon />}
                      onPress={() => {
                        setEditId(null);
                        setForm({
                          nombre: '',
                          apellido: '',
                          cedula: '',
                          email: '',
                          telefono: '',
                          cargo: '',
                          password: '',
                          idArea: '',
                          idFicha: '',
                          idRol: '',
                        });
                        onOpen();
                      }}
                    >
                      Nuevo Usuario
                    </Button>
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

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
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
                    />
                    <Input
                      label="Apellido"
                      value={form.apellido}
                      onValueChange={v => setForm(p => ({ ...p, apellido: v }))}
                      radius="sm"
                    />
                    <Input
                      label="Cédula"
                      value={form.cedula}
                      onValueChange={v => setForm(p => ({ ...p, cedula: v }))}
                      radius="sm"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onValueChange={v => setForm(p => ({ ...p, email: v }))}
                      radius="sm"
                    />
                    <Input
                      label="Teléfono"
                      value={form.telefono}
                      onValueChange={v => setForm(p => ({ ...p, telefono: v }))}
                      radius="sm"
                    />
                    <Input
                      label="Cargo"
                      value={form.cargo}
                      onValueChange={v => setForm(p => ({ ...p, cargo: v }))}
                      radius="sm"
                    />
                    {!editId && (
                      <Input
                        label="Contraseña"
                        type="password"
                        value={form.password}
                        onValueChange={v => setForm(p => ({ ...p, password: v }))}
                        radius="sm"
                        required
                      />
                    )}
                    <Select
                      label="Área"
                      selectedKeys={form.idArea ? new Set([form.idArea]) : new Set()}
                      onSelectionChange={k => setForm(p => ({ ...p, idArea: String(Array.from(k)[0]) }))}
                      radius="sm"
                    >
                      {areas.map(a => (
                        <SelectItem key={a.id}>{a.nombreArea}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Ficha de Formación"
                      selectedKeys={form.idFicha ? new Set([form.idFicha]) : new Set()}
                      onSelectionChange={k => setForm(p => ({ ...p, idFicha: String(Array.from(k)[0]) }))}
                      radius="sm"
                    >
                      {fichas.map(f => (
                        <SelectItem key={f.id}>{f.nombre}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Rol"
                      selectedKeys={form.idRol ? new Set([form.idRol]) : new Set()}
                      onSelectionChange={k => setForm(p => ({ ...p, idRol: String(Array.from(k)[0]) }))}
                      radius="sm"
                    >
                      {roles.map(r => (
                        <SelectItem key={r.id}>{r.nombreRol}</SelectItem>
                      ))}
                    </Select>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <Button variant="light" onPress={onCloseLocal} type="button">
                        Cancelar
                      </Button>
                      <Button variant="flat" type="submit">
                        {editId ? 'Actualizar' : 'Crear'}
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UsuariosPage;
