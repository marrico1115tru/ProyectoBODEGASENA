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
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from '@/Api/centrosformacionTable';
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
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: 'Ubicación', uid: 'ubicacion', sortable: false },
  { name: 'Teléfono', uid: 'telefono', sortable: false },
  { name: 'Email', uid: 'email', sortable: false },
  { name: 'Municipio', uid: 'municipio', sortable: false },
  { name: '# Sedes', uid: 'sedes', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombre',
  'ubicacion',
  'telefono',
  'email',
  'municipio',
  'sedes',
  'actions',
];

const CentrosFormacionPage = () => {
  /* Estado */
  const [centros, setCentros] = useState<any[]>([]);
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

  /* Formulario */
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [idMunicipio, setIdMunicipio] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  /* UI helpers */
  const [toastMsg, setToastMsg] = useState('');
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* Cargar datos */
  const cargarCentros = async () => {
    try {
      const data = await getCentrosFormacion();
      setCentros(data);
    } catch (err) {
      console.error('Error cargando centros', err);
    }
  };
  useEffect(() => {
    cargarCentros();
  }, []);

  /* CRUD */
  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar centro? No se podrá recuperar.')) return;
    await deleteCentroFormacion(id);
    cargarCentros();
    notify(`🗑️ Centro eliminado: ID ${id}`);
  };

  const guardar = async () => {
    const payload = {
      nombre,
      ubicacion,
      telefono,
      email,
      idMunicipio: { id: parseInt(idMunicipio) },
    };
    if (editId) {
      await updateCentroFormacion(editId, payload);
    } else {
      if (!idMunicipio) {
        notify('Debe ingresar un ID de municipio');
        return;
      }
      await createCentroFormacion({
        ...payload,
        idMunicipio: { id: parseInt(idMunicipio) },
      });
    }
    onClose();
    setNombre('');
    setUbicacion('');
    setTelefono('');
    setEmail('');
    setIdMunicipio('');
    setEditId(null);
    cargarCentros();
  };

  const abrirModalEditar = (c: any) => {
    setEditId(c.id);
    setNombre(c.nombre || '');
    setUbicacion(c.ubicacion || '');
    setTelefono(c.telefono || '');
    setEmail(c.email || '');
    setIdMunicipio(c.idMunicipio?.id?.toString() || '');
    onOpen();
  };

  /* 🔍 Filtro */
  const filtered = useMemo(
    () =>
      filterValue
        ? centros.filter((c) =>
            (
              `${c.nombre} ${c.ubicacion} ${c.email} ${c.idMunicipio?.nombre || ''}`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : centros,
    [centros, filterValue]
  );

  /* 📑 Paginación */
  const pages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  /* ↕️ Orden */
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

  /* Render cell */
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return (
          <span className="font-medium text-gray-800 capitalize break-words max-w-[16rem]">
            {item.nombre}
          </span>
        );
      case 'ubicacion':
        return <span className="text-sm text-gray-600">{item.ubicacion}</span>;
      case 'telefono':
        return <span className="text-sm text-gray-600">{item.telefono}</span>;
      case 'email':
        return <span className="text-sm text-gray-600">{item.email}</span>;
      case 'municipio':
        return (
          <span className="text-sm text-gray-600">
            {item.idMunicipio?.nombre || '—'}
          </span>
        );
      case 'sedes':
        return (
          <span className="text-sm text-gray-600">{item.sedes?.length || 0}</span>
        );
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
              <DropdownItem onPress={() => abrirModalEditar(item)} key={''}>
                Editar
              </DropdownItem>
              <DropdownItem onPress={() => eliminar(item.id)} key={''}>
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey as keyof typeof item];
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
          placeholder="Buscar por nombre, ubicación o municipio"
          startContent={<SearchIcon className="text-[#0D1324]" />}
          value={filterValue}
          onValueChange={setFilterValue}
          onClear={() => setFilterValue('')}
        />
        <div className="flex gap-3">
          {/* Column selector */}
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
          {/* Nuevo centro */}
          <Button
            className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
            endContent={<PlusIcon />}
            onPress={onOpen}
          >
            Nuevo Centro
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {centros.length} centros
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

  /* Bottom content */
  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center gap-2">
      <Button
        size="sm"
        variant="flat"
        isDisabled={page === 1}
        onPress={() => setPage(page - 1)}
      >
        Anterior
      </Button>
      <Pagination
        isCompact
        showControls
        page={page}
        total={pages}
        onChange={setPage}
      />
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
            🏫 Gestión de Centros de Formación
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra los centros disponibles.
          </p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de centros"
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
            <TableHeader
              columns={columns.filter((c) => visibleColumns.has(c.uid))}
            >
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
            <TableBody items={sorted} emptyContent="No se encontraron centros">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => (
                    <TableCell>{renderCell(item, col as string)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards móvil */}
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">
              No se encontraron centros
            </p>
          )}
          {sorted.map((c) => (
            <Card key={c.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg break-words max-w-[14rem]">
                    {c.nombre}
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
                      <DropdownItem onPress={() => abrirModalEditar(c)} key={''}>
                        Editar
                      </DropdownItem>
                      <DropdownItem onPress={() => eliminar(c.id)} key={''}>
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ubicación:</span> {c.ubicacion}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teléfono:</span> {c.telefono}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {c.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Municipio:</span>{' '}
                  {c.idMunicipio?.nombre || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium"># Sedes:</span>{' '}
                  {c.sedes?.length || 0}
                </p>
                <p className="text-xs text-gray-400">ID: {c.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {(onCloseLocal) => (
              <>
                <ModalHeader>
                  {editId ? 'Editar Centro' : 'Nuevo Centro'}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del centro"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                  />
                  <Input
                    label="Ubicación"
                    placeholder="Dirección o ubicación"
                    value={ubicacion}
                    onValueChange={setUbicacion}
                    radius="sm"
                  />
                  <Input
                    label="Teléfono"
                    placeholder="Teléfono de contacto"
                    value={telefono}
                    onValueChange={setTelefono}
                    radius="sm"
                  />
                  <Input
                    label="Email"
                    placeholder="Correo electrónico"
                    value={email}
                    onValueChange={setEmail}
                    radius="sm"
                  />
                  <Input
                    label="ID Municipio"
                    placeholder="Ej: 2"
                    value={idMunicipio}
                    onValueChange={setIdMunicipio}
                    radius="sm"
                  />
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

export default CentrosFormacionPage;
