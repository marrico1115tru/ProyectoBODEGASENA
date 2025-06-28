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
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from '@/Api/inventario';
import { getProductos } from '@/Api/Productosform';        // 👈 utilízalo si ya lo tienes
import { getSitios } from '@/Api/SitioService';                 // 👈 idem para sitios
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { InventarioFormValues } from '@/types/types/inventario';

/* ✅ Toast ---------------------------------------------------------------- */
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

/* ✅ Columnas ------------------------------------------------------------- */
const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Producto', uid: 'producto', sortable: false },
  { name: 'Sitio', uid: 'sitio', sortable: false },
  { name: 'Stock', uid: 'stock', sortable: true },
  { name: 'Acciones', uid: 'actions' },
] as const;
type ColumnKey = (typeof columns)[number]['uid'];
const INITIAL_VISIBLE_COLUMNS = new Set<ColumnKey>([
  'id',
  'producto',
  'sitio',
  'stock',
  'actions',
]);

/* ───────────────────────────────────────────────────────────────────────── */
const InventarioPage = () => {
  /* Estado ---------------------------------------------------------------- */
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [sitios, setSitios] = useState<any[]>([]);

  /* Tabla, filtros, orden ------------------------------------------------- */
  const [filter, setFilter] = useState('');
  const [visibleCols, setVisibleCols] = useState(INITIAL_VISIBLE_COLUMNS);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  /* Formulario modal ------------------------------------------------------ */
  const [form, setForm] = useState({
    stock: '',
    idProductoId: '',
    fkSitioId: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const {
    isOpen: isModalOpen,
    onOpenChange,
    onOpen,
    onClose,
  } = useDisclosure();

  /* Toast ----------------------------------------------------------------- */
  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* Obtener datos --------------------------------------------------------- */
  const cargarDatos = async () => {
    const [inv, prod, sit] = await Promise.all([
      getInventarios(),
      getProductos(),
      getSitios(),
    ]);
    setInventarios(inv);
    setProductos(prod);
    setSitios(sit);
  };
  useEffect(() => { cargarDatos(); }, []);

  /* CRUD ------------------------------------------------------------------ */
  const guardar = async () => {
    const payload: InventarioFormValues = {
      stock: Number(form.stock),
      idProductoId: Number(form.idProductoId),
      fkSitioId: Number(form.fkSitioId),
    };
    if (editId) await updateInventario(editId, payload);
    else await createInventario(payload);

    onClose();
    setEditId(null);
    setForm({ stock: '', idProductoId: '', fkSitioId: '' });
    cargarDatos();
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar registro de inventario?')) return;
    await deleteInventario(id);
    cargarDatos();
    notify(🗑️ Inventario eliminado: ID ${id});
  };

  const abrirEditar = (row: any) => {
    setEditId(row.idProductoInventario);
    setForm({
      stock: row.stock.toString(),
      idProductoId: row.idProducto?.id.toString() || '',
      fkSitioId: row.fkSitio?.id.toString() || '',
    });
    onOpen();
  };

  const abrirNuevo = () => {
    setEditId(null);
    setForm({ stock: '', idProductoId: '', fkSitioId: '' });
    onOpen();
  };

  /* Filtrar, ordenar, paginar -------------------------------------------- */
  const filtered = useMemo(
    () =>
      filter
        ? inventarios.filter((i) =>
            ${i.idProducto?.nombre ?? ''} ${i.fkSitio?.nombre ?? ''}
              .toLowerCase()
              .includes(filter.toLowerCase()),
          )
        : inventarios,
    [inventarios, filter],
  );
  const pages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const sliced = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage],
  );
  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;
    items.sort((a, b) => {
      const x = column === 'id' ? a.idProductoInventario : a[column];
      const y = column === 'id' ? b.idProductoInventario : b[column];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  /* Render cell ----------------------------------------------------------- */
  const renderCell = (item: any, key: ColumnKey) => {
    switch (key) {
      case 'id':
        return item.idProductoInventario;
      case 'producto':
        return item.idProducto?.nombre ?? '—';
      case 'sitio':
        return item.fkSitio?.nombre ?? '—';
      case 'stock':
        return item.stock;
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onPress={() => abrirEditar(item)} key={''}>Editar</DropdownItem>
              <DropdownItem onPress={() => eliminar(item.idProductoInventario)} key={''}>Eliminar</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[key];
    }
  };

  /* Top content ----------------------------------------------------------- */
  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          radius="lg"
          placeholder="Buscar por producto o sitio"
          startContent={<SearchIcon className="text-[#0D1324]" />}
          value={filter}
          onValueChange={setFilter}
          onClear={() => setFilter('')}
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
                  <DropdownItem key={col.uid}>
                    <Checkbox
                      isSelected={visibleCols.has(col.uid)}
                      onValueChange={() =>
                        setVisibleCols((prev) => {
                          const copy = new Set(prev);
                          copy.has(col.uid) ? copy.delete(col.uid) : copy.add(col.uid);
                          return copy;
                        })
                      }
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
            onPress={abrirNuevo}
          >
            Nuevo Inventario
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">Total {inventarios.length} registros</span>
        <label className="flex items-center text-default-400 text-sm">
          Filas:&nbsp;
          <select
            className="bg-transparent outline-none text-default-600 ml-1"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 15].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  /* Bottom content -------------------------------------------------------- */
  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center gap-2">
      <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
        Anterior
      </Button>
      <Pagination isCompact showControls page={page} total={Math.max(pages, 1)} onChange={setPage} />
      <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>
        Siguiente
      </Button>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}
      <div className="p-6 space-y-6">
        {/* Encabezado */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📦 Gestión de Inventario
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra stock por sitio y producto.</p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de inventario"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            topContent={topContent}
            bottomContent={bottomContent}
            classNames={{
              th: 'py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm',
              td: 'align-middle py-3 px-4',
            }}
          >
            <TableHeader columns={columns.filter((c) => visibleCols.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                  width={col.uid === 'producto' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron registros">
              {(row) => (
                <TableRow key={row.idProductoInventario}>
                  {(key) => <TableCell>{renderCell(row, key as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards móvil */}
        <div className="grid gap-4 md:hidden">
          {sorted.length ? (
            sorted.map((i) => (
              <Card key={i.idProductoInventario} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg break-words">
                      {i.idProducto?.nombre ?? 'Producto'}
                    </h3>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                          <MoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem onPress={() => abrirEditar(i)} key={''}>Editar</DropdownItem>
                        <DropdownItem onPress={() => eliminar(i.idProductoInventario)} key={''}>Eliminar</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sitio:</span> {i.fkSitio?.nombre ?? '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Stock:</span> {i.stock}
                  </p>
                  <p className="text-xs text-gray-400">ID: {i.idProductoInventario}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No se encontraron registros</p>
          )}
        </div>

        {/* Modal CRUD inventario ------------------------------------------- */}
        <Modal
          isOpen={isModalOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {() => (
              <>
                <ModalHeader>{editId ? 'Editar Inventario' : 'Nuevo Inventario'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onValueChange={(v) => setForm((p) => ({ ...p, stock: v }))}
                  />
                  <Select
                    label="Producto"
                    selectedKeys={form.idProductoId ? new Set([form.idProductoId]) : new Set()}
                    onSelectionChange={(k) =>
                      setForm((p) => ({ ...p, idProductoId: Array.from(k)[0] as string }))
                    }
                  >
                    {productos.map((p) => (
                      <SelectItem key={p.id}>{p.nombre}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Sitio"
                    selectedKeys={form.fkSitioId ? new Set([form.fkSitioId]) : new Set()}
                    onSelectionChange={(k) =>
                      setForm((p) => ({ ...p, fkSitioId: Array.from(k)[0] as string }))
                    }
                  >
                    {sitios.map((s) => (
                      <SelectItem key={s.id}>{s.nombre}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
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

export default InventarioPage;