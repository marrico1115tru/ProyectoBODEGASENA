// src/pages/FichasFormacionPage.tsx
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
  getFichasFormacion,
  createFichaFormacion,
  updateFichaFormacion,
  deleteFichaFormacion,
} from '@/Api/fichasFormacion';
import { getTitulados } from '@/Api/TituladosService';
import { getUsuarios } from '@/Api/Usuariosform';
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
  { name: 'Titulado', uid: 'titulado', sortable: false },
  { name: 'Responsable', uid: 'responsable', sortable: false },
  { name: '# Usuarios', uid: 'usuarios', sortable: false },
  { name: '# Entregas', uid: 'entregas', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombre',
  'titulado',
  'responsable',
  'usuarios',
  'entregas',
  'actions',
];

const FichasFormacionPage = () => {
  /* Estado */
  const [fichas, setFichas] = useState<any[]>([]);
  const [titulados, setTitulados] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
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
  const [idTitulado, setIdTitulado] = useState<number | ''>('');
  const [idResponsable, setIdResponsable] = useState<number | ''>('');
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
      const [fs, ts, us] = await Promise.all([
        getFichasFormacion(),
        getTitulados(),
        getUsuarios(),
      ]);
      setFichas(fs);
      setTitulados(ts);
      setUsuarios(us);
    } catch (err) {
      console.error('Error cargando fichas', err);
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  /* CRUD */
  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar ficha? No se podrá recuperar.')) return;
    await deleteFichaFormacion(id);
    cargarDatos();
    notify(`🗑️ Ficha eliminada: ID ${id}`);
  };

  const guardar = async () => {
    const payload = {
      nombre,
      idTitulado: idTitulado ? { id: Number(idTitulado) } : null,
      idUsuarioResponsable: idResponsable ? { id: Number(idResponsable) } : null,
    };
    editId
      ? await updateFichaFormacion(editId, payload)
      : await createFichaFormacion(payload);
    onClose();
    limpiarForm();
    cargarDatos();
  };

  const abrirModalEditar = (f: any) => {
    setEditId(f.id);
    setNombre(f.nombre || '');
    setIdTitulado(f.idTitulado?.id || '');
    setIdResponsable(f.idUsuarioResponsable?.id || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setNombre('');
    setIdTitulado('');
    setIdResponsable('');
  };

  /* Filtro + Orden + Paginación */
  const filtered = useMemo(
    () =>
      filterValue
        ? fichas.filter((f) =>
            (
              `${f.nombre} ${f.idTitulado?.nombre || ''} ${
                f.idUsuarioResponsable?.nombre || ''
              }`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : fichas,
    [fichas, filterValue]
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

  /* Render Cell */
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return (
          <span className="font-medium text-gray-800 break-words max-w-[18rem]">
            {item.nombre}
          </span>
        );
      case 'titulado':
        return (
          <span className="text-sm text-gray-600">
            {item.idTitulado?.nombre || '—'}
          </span>
        );
      case 'responsable':
        return (
          <span className="text-sm text-gray-600">
            {item.idUsuarioResponsable
              ? `${item.idUsuarioResponsable.nombre} ${item.idUsuarioResponsable.apellido ?? ''}`
              : '—'}
          </span>
        );
      case 'usuarios':
        return (
          <span className="text-sm text-gray-600">{item.usuarios?.length || 0}</span>
        );
      case 'entregas':
        return (
          <span className="text-sm text-gray-600">
            {item.entregaMaterials?.length || 0}
          </span>
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
              <DropdownItem onPress={() => eliminar(item.id)} key={''}>Eliminar</DropdownItem>
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
          placeholder="Buscar por nombre, titulado o responsable"
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
              limpiarForm();
              onOpen();
            }}
          >
            Nueva Ficha
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {fichas.length} fichas
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
            🎓 Gestión de Fichas de Formación
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra las fichas académicas.
          </p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de fichas"
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
                  width={col.uid === 'nombre' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron fichas">
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
            <p className="text-center text-gray-500">No se encontraron fichas</p>
          )}
          {sorted.map((f) => (
            <Card key={f.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg break-words max-w-[14rem]">
                    {f.nombre}
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
                      <DropdownItem onPress={() => abrirModalEditar(f)} key={''}>
                        Editar
                      </DropdownItem>
                      <DropdownItem onPress={() => eliminar(f.id)} key={''}>
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Titulado:</span>{' '}
                  {f.idTitulado?.nombre || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Responsable:</span>{' '}
                  {f.idUsuarioResponsable
                    ? `${f.idUsuarioResponsable.nombre} ${f.idUsuarioResponsable.apellido ?? ''}`
                    : '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Usuarios:</span>{' '}
                  {f.usuarios?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Entregas:</span>{' '}
                  {f.entregaMaterials?.length || 0}
                </p>
                <p className="text-xs text-gray-400">ID: {f.id}</p>
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
                <ModalHeader>
                  {editId ? 'Editar Ficha' : 'Nueva Ficha'}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Ej: Ficha 2567890 - ADSI"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                  />
                  {/* Titulado */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Titulado
                    </label>
                    <select
                      value={idTitulado}
                      onChange={(e) => setIdTitulado(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un titulado</option>
                      {titulados.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Responsable */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Responsable
                    </label>
                    <select
                      value={idResponsable}
                      onChange={(e) =>
                        setIdResponsable(Number(e.target.value) || '')
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un responsable</option>
                      {usuarios.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {`${u.nombre} ${u.apellido ?? ''}`}
                        </option>
                      ))}
                    </select>
                  </div>
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

export default FichasFormacionPage;
