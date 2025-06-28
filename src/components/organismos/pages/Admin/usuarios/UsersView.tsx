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
  ModalFooter,
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
import { Card, CardContent } from '@/components/ui/card';

/* 🟢 Toast */
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

/* 📊 Columnas */
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
  /* Estado principal */
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  /* Formulario modal */
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

  /* UI */
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* Obtener datos */
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
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  /* CRUD */
  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar usuario?  No se podrá recuperar.')) return;
    await deleteUsuario(id);
    cargarDatos();
    notify(`🗑️ Usuario eliminado: ID ${id}`);
  };

  const guardar = async () => {
    const payload = {
      nombre: form.nombre,
      apellido: form.apellido || null,
      cedula: form.cedula || null,
      email: form.email || null,
      telefono: form.telefono || null,
      password: form.password || '1234',
      idArea: { id: Number(form.idArea) },
      idFichaFormacion: { id: Number(form.idFicha) },
      rol: form.idRol ? Number(form.idRol) : null,
    };
    editId ? await updateUsuario(editId, payload) : await createUsuario(payload);
    onClose();
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
    cargarDatos();
  };

  const abrirModalEditar = (u: any) => {
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
    onOpen();
  };

  /* Filtro + Orden + Paginación */
  const filtered = useMemo(
    () =>
      filterValue
        ? usuarios.filter((u) =>
            `${u.nombre} ${u.apellido ?? ''} ${u.cedula ?? ''} ${u.email ?? ''}`
              .toLowerCase()
              .includes(filterValue.toLowerCase()),
          )
        : usuarios,
    [usuarios, filterValue],
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
      const x = a[column];
      const y = b[column];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  /* Render Cell */
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
              <DropdownItem onPress={() => abrirModalEditar(item)} key={''}>Editar</DropdownItem>
              <DropdownItem onPress={() => eliminar(item.id)} key={''}>Eliminar</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item] ?? '—';
    }
  };

  /* Columnas visibles */
  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  /* Top content */
  const topContent = (
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
        <span className="text-default-400 text-sm">
          Total {usuarios.length} usuarios
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

  /* Bottom content */
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

  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        {/* Encabezado */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            👥 Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra los usuarios registrados.
          </p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de usuarios"
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
                  width={col.uid === 'nombreCompleto' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron usuarios">
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
            <p className="text-center text-gray-500">No se encontraron usuarios</p>
          )}
          {sorted.map((u) => (
            <Card key={u.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {u.nombre} {u.apellido ?? ''}
                  </h3>
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
                      <DropdownItem onPress={() => abrirModalEditar(u)} key={''}>Editar</DropdownItem>
                      <DropdownItem onPress={() => eliminar(u.id)} key={''}>Eliminar</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cédula:</span> {u.cedula ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {u.email ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Área:</span> {u.idArea?.nombreArea ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ficha:</span> {u.idFichaFormacion?.nombre ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Rol:</span> {u.rol?.nombreRol ?? '—'}
                </p>
                <p className="text-xs text-gray-400">ID: {u.id}</p>
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
                <ModalHeader>{editId ? 'Editar Usuario' : 'Nuevo Usuario'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    value={form.nombre}
                    onValueChange={(v) => setForm((p) => ({ ...p, nombre: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Apellido"
                    value={form.apellido}
                    onValueChange={(v) => setForm((p) => ({ ...p, apellido: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Cédula"
                    value={form.cedula}
                    onValueChange={(v) => setForm((p) => ({ ...p, cedula: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onValueChange={(v) => setForm((p) => ({ ...p, email: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Teléfono"
                    value={form.telefono}
                    onValueChange={(v) => setForm((p) => ({ ...p, telefono: v }))}
                    radius="sm"
                  />
                  {/* Sólo al crear */}
                  {!editId && (
                    <Input
                      label="Contraseña"
                      type="password"
                      value={form.password}
                      onValueChange={(v) => setForm((p) => ({ ...p, password: v }))}
                      radius="sm"
                    />
                  )}
                  <Select
                    label="Área"
                    selectedKey={form.idArea}
                    onSelectionChange={(k) => setForm((p) => ({ ...p, idArea: k as string }))}
                  >
                    {areas.map((a) => (
                      <SelectItem key={a.id}>{a.nombreArea}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Ficha de Formación"
                    selectedKey={form.idFicha}
                    onSelectionChange={(k) => setForm((p) => ({ ...p, idFicha: k as string }))}
                  >
                    {fichas.map((f) => (
                      <SelectItem key={f.id}>{f.nombre}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Rol"
                    selectedKey={form.idRol}
                    onSelectionChange={(k) => setForm((p) => ({ ...p, idRol: k as string }))}
                  >
                    {roles.map((r) => (
                      <SelectItem key={r.id}>{r.nombreRol}</SelectItem>
                    ))}
                  </Select>
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

export default UsuariosPage;
