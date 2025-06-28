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
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from '@/Api/inventario';
import { getSitios } from '@/Api/SitioService';
import { getProductos } from '@/Api/Productosform';
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
  { name: 'Producto', uid: 'producto', sortable: false },
  { name: 'Sitio', uid: 'sitio', sortable: false },
  { name: 'Stock', uid: 'stock', sortable: false },
  { name: '# Mov', uid: 'movimientos', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'producto',
  'sitio',
  'stock',
  'movimientos',
  'actions',
];

const InventarioPage = () => {
  /* Estado principal */
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [sitios, setSitios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
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

  /* Formulario modal */
  const [stock, setStock] = useState<number | ''>('');
  const [idProducto, setIdProducto] = useState<number | ''>('');
  const [idSitio, setIdSitio] = useState<number | ''>('');
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
      const [invs, sits, prods] = await Promise.all([
        getInventarios(),
        getSitios(),
        getProductos(),
      ]);
      setInventarios(invs);
      setSitios(sits);
      setProductos(prods);
    } catch (err) {
      console.error('Error cargando inventario', err);
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  /* CRUD */
  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar registro? No se podrá recuperar.')) return;
    await deleteInventario(id);
    cargarDatos();
    notify(`🗑️ Inventario eliminado: ID ${id}`);
  };

  const guardar = async () => {
    const payload = {
      stock,
      fkSitioId: idSitio ? Number(idSitio) : undefined,
      idProductoId: idProducto ? Number(idProducto) : undefined,
    };
    editId
      ? await updateInventario(editId, payload)
      : await createInventario(payload);
    onClose();
    limpiarForm();
    cargarDatos();
  };

  const abrirModalEditar = (inv: any) => {
    setEditId(inv.idProductoInventario);
    setStock(inv.stock);
    setIdProducto(inv.idProducto?.id || '');
    setIdSitio(inv.fkSitio?.id || '');
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setStock('');
    setIdProducto('');
    setIdSitio('');
  };

  /* Filtro + Orden + Paginación */
  const filtered = useMemo(
    () =>
      filterValue
        ? inventarios.filter((i) =>
            (
              `${i.idProducto?.nombre || ''} ${i.fkSitio?.nombre || ''}`
            )
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : inventarios,
    [inventarios, filterValue]
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
      const x = a[column === 'id' ? 'idProductoInventario' : column];
      const y = b[column === 'id' ? 'idProductoInventario' : column];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  /* Render Cell */
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'producto':
        return <span className="text-sm text-gray-800">{item.idProducto?.nombre}</span>;
      case 'sitio':
        return <span className="text-sm text-gray-600">{item.fkSitio?.nombre}</span>;
      case 'stock':
        return <span className="text-sm text-gray-800">{item.stock}</span>;
      case 'movimientos':
        return (
          <span className="text-sm text-gray-600">{item.movimientos?.length || 0}</span>
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
              <DropdownItem onPress={() => eliminar(item.idProductoInventario)} key={''}>
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
          placeholder="Buscar por producto o sitio"
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
            Nuevo Inventario
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">
          Total {inventarios.length} registros
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
            📦 Inventario
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra el stock disponible.</p>
        </header>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de inventario"
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
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron registros">
              {(item) => (
                <TableRow key={item.idProductoInventario}>
                  {(col) => <TableCell>{renderCell(item, col as string)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards móvil */}
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron registros</p>
          )}
          {sorted.map((i) => (
            <Card key={i.idProductoInventario} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{i.idProducto?.nombre}</h3>
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
                      <DropdownItem onPress={() => abrirModalEditar(i)} key={''}>Editar</DropdownItem>
                      <DropdownItem onPress={() => eliminar(i.idProductoInventario)} key={''}>
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Sitio:</span> {i.fkSitio?.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span> {i.stock}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Movimientos:</span>{' '}
                  {i.movimientos?.length || 0}
                </p>
                <p className="text-xs text-gray-400">ID: {i.idProductoInventario}</p>
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
                  {editId ? 'Editar Inventario' : 'Nuevo Inventario'}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  {/* Producto */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Producto
                    </label>
                    <select
                      value={idProducto}
                      onChange={(e) => setIdProducto(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Sitio */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Sitio
                    </label>
                    <select
                      value={idSitio}
                      onChange={(e) => setIdSitio(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un sitio</option>
                      {sitios.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Stock */}
                  <Input
                    label="Stock"
                    placeholder="Ej: 100"
                    type="number"
                    value={stock.toString()}
                    onValueChange={(v) => setStock(v ? Number(v) : '')}
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

export default InventarioPage;
