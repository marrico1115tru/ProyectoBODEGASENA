// src/pages/ProductosPage.tsx
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
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '@/Api/Productosform';
import { getCategoriasProductos } from '@/Api/Categorias';
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
  { name: 'Descripción', uid: 'descripcion', sortable: false },
  { name: 'Categoría', uid: 'categoria', sortable: false },
  { name: 'Stock', uid: 'stock', sortable: false },
  { name: 'Vencimiento', uid: 'fechaVencimiento', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombre',
  'descripcion',
  'categoria',
  'stock',
  'fechaVencimiento',
  'actions',
];

const ProductosPage = () => {
  /* Estado */
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

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
    descripcion: '',
    fechaVencimiento: '',
    idCategoriaId: '',
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
      const [prod, cat] = await Promise.all([getProductos(), getCategoriasProductos()]);
      setProductos(prod);
      setCategorias(cat);
    } catch (err) {
      console.error('Error cargando datos', err);
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  /* CRUD */
  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar producto? No se podrá recuperar.')) return;
    await deleteProducto(id);
    cargarDatos();
    notify(`🗑️ Producto eliminado: ID ${id}`);
  };

  const guardar = async () => {
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      fechaVencimiento: form.fechaVencimiento || null,
      idCategoriaId: Number(form.idCategoriaId),
    };
    editId ? await updateProducto(editId, payload) : await createProducto(payload);
    onClose();
    setForm({ nombre: '', descripcion: '', fechaVencimiento: '', idCategoriaId: '' });
    setEditId(null);
    cargarDatos();
  };

  const abrirModalEditar = (p: any) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      fechaVencimiento: p.fechaVencimiento || '',
      idCategoriaId: p.idCategoria?.id?.toString() || '',
    });
    onOpen();
  };

  /* Filtro + Orden + Paginación */
  const filtered = useMemo(
    () =>
      filterValue
        ? productos.filter((p) =>
            `${p.nombre} ${p.descripcion ?? ''} ${p.idCategoria?.nombre ?? ''}`
              .toLowerCase()
              .includes(filterValue.toLowerCase()),
          )
        : productos,
    [productos, filterValue],
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

  /* Helpers */
  const totalStock = (inv: any[]) =>
    inv?.reduce((acc: number, i: any) => acc + (i.stock ?? 0), 0) ?? 0;

  /* Render Cell */
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'descripcion':
        return (
          <span className="text-sm text-gray-600 break-words max-w-[18rem]">
            {item.descripcion ?? '—'}
          </span>
        );
      case 'categoria':
        return <span className="text-sm text-gray-600">{item.idCategoria?.nombre ?? '—'}</span>;
      case 'stock':
        return <span className="text-sm text-gray-600">{totalStock(item.inventarios)}</span>;
      case 'fechaVencimiento':
        return (
          <span className="text-sm text-gray-600">
            {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : '—'}
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
              <DropdownItem onPress={() => abrirModalEditar(item)} key={''}>Editar</DropdownItem>
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
          placeholder="Buscar por nombre, descripción o categoría"
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
              setForm({ nombre: '', descripcion: '', fechaVencimiento: '', idCategoriaId: '' });
              onOpen();
            }}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {productos.length} productos
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
            🛠️ Gestión de Productos
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra los productos disponibles.
          </p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de productos"
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
                  width={col.uid === 'descripcion' ? 280 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron productos">
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
            <p className="text-center text-gray-500">No se encontraron productos</p>
          )}
          {sorted.map((p) => (
            <Card key={p.id} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{p.nombre}</h3>
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
                      <DropdownItem onPress={() => abrirModalEditar(p)} key={''}>Editar</DropdownItem>
                      <DropdownItem onPress={() => eliminar(p.id)} key={''}>Eliminar</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">{p.descripcion ?? 'Sin descripción'}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Categoría:</span>{' '}
                  {p.idCategoria?.nombre ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span> {totalStock(p.inventarios)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Vencimiento:</span>{' '}
                  {p.fechaVencimiento
                    ? new Date(p.fechaVencimiento).toLocaleDateString()
                    : '—'}
                </p>
                <p className="text-xs text-gray-400">ID: {p.id}</p>
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
                <ModalHeader>{editId ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    value={form.nombre}
                    onValueChange={(v) => setForm((p) => ({ ...p, nombre: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Descripción"
                    value={form.descripcion}
                    onValueChange={(v) => setForm((p) => ({ ...p, descripcion: v }))}
                    radius="sm"
                  />
                  <Input
                    label="Fecha de vencimiento"
                    type="date"
                    value={form.fechaVencimiento}
                    onValueChange={(v) => setForm((p) => ({ ...p, fechaVencimiento: v }))}
                    radius="sm"
                  />
                  <Select
                    label="Categoría"
                    selectedKey={form.idCategoriaId}
                    onSelectionChange={(k) =>
                      setForm((p) => ({ ...p, idCategoriaId: k as string }))
                    }
                  >
                    {categorias.map((c) => (
                      <SelectItem key={c.id}>{c.nombre}</SelectItem>
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

export default ProductosPage;
