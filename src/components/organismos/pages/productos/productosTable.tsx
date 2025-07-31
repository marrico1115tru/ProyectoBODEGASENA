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
import {
  getCategoriasProductos,
  createCategoriaProducto,
} from '@/Api/Categorias';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getDecodedTokenFromCookies } from '@/lib/utils';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'nombre', sortable: false },
  { name: 'Descripción', uid: 'descripcion', sortable: false },
  { name: 'Categoría', uid: 'categoria', sortable: false },
  { name: 'Stock', uid: 'stock', sortable: false },
  { name: 'Vencimiento', uid: 'fechaVencimiento', sortable: false },
  { name: 'Acciones', uid: 'actions' },
] as const;

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'nombre',
  'descripcion',
  'categoria',
  'stock',
  'fechaVencimiento',
  'actions',
] as const;

type ColumnKey = (typeof columns)[number]['uid'];

const ProductosPage = () => {
 
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(
    new Set<string>(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    idCategoriaId: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [catForm, setCatForm] = useState({ nombre: '', unpsc: '' });
  const [prodOpen, setProdOpen] = useState(false); 
  const [permisos, setPermisos] = useState({
  puedeVer: false,
  puedeCrear: false,
  puedeEditar: false,
  puedeEliminar: false
});

  const { isOpen: catOpen, onOpenChange: setCatOpen } = useDisclosure(); 

  
  const cargarDatos = async () => {
    try {
      const [prod, cat] = await Promise.all([getProductos(), getCategoriasProductos()]);
      setProductos(prod);
      setCategorias(cat);
    } catch (error) {
      console.error('Error cargando datos:', error);
      await MySwal.fire('Error', 'Error cargando productos y categorías', 'error');
    }
  };
  useEffect(() => { cargarDatos(); }, []);
  
  useEffect(() => {
      const fetchModulos = async () => {
        try {
          const userData = getDecodedTokenFromCookies("token");
          const rolId = userData?.rol?.id;
          if (!rolId) return;
  
          //const url = `http://localhost:3000/permisos/modulos/${rolId}`;
          const url = `http://localhost:3000/permisos/por-ruta?ruta=/productos/listar&idRol=${rolId}`;
          const response = await axios.get(url, { withCredentials: true });
  
          console.log('Permisos para productos listar:', response.data.data);
          setPermisos(permisosData); 
        } catch (err) {
          //setError("Error al obtener permisos de módulos");
          console.error(err);
        } finally {
          //setLoading(false);
        }
      };
  
      fetchModulos();
    }, []);

 
  const guardarProducto = async () => {
    if (!form.nombre.trim()) {
      await MySwal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion.trim() ? form.descripcion : null,
      fechaVencimiento: form.fechaVencimiento || undefined,
      idCategoriaId: Number(form.idCategoriaId),
    };
    try {
      if (editId) {
        await updateProducto(editId, payload);
        await MySwal.fire('Éxito', 'Producto actualizado', 'success');
      } else {
        await createProducto(payload);
        await MySwal.fire('Éxito', 'Producto creado', 'success');
      }
      setProdOpen(false);
      setEditId(null);
      setForm({ nombre: '', descripcion: '', fechaVencimiento: '', idCategoriaId: '' });
      await cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error guardando producto', 'error');
    }
  };

  const eliminar = async (id: number) => {
    const result = await MySwal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProducto(id);
      await MySwal.fire('Eliminado', `Producto ID ${id} eliminado`, 'success');
      await cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error eliminando producto', 'error');
    }
  };

  const abrirNuevo = () => {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', fechaVencimiento: '', idCategoriaId: '' });
    setProdOpen(true);
  };

  const abrirEditar = (p: any) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      fechaVencimiento: p.fechaVencimiento || '',
      idCategoriaId: p.idCategoria?.id?.toString() || '',
    });
    setProdOpen(true);
  };

 
  const guardarCategoria = async () => {
    if (!catForm.nombre.trim()) {
      await MySwal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }
    try {
      await createCategoriaProducto({ nombre: catForm.nombre, unpsc: catForm.unpsc || undefined });
      await cargarDatos();
      setCatForm({ nombre: '', unpsc: '' });
      setCatOpen();
      await MySwal.fire('Éxito', 'Categoría creada', 'success');
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error creando categoría', 'error');
    }
  };


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
  const sliced = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage],
  );
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


  const totalStock = (inv: any[]) =>
    inv?.reduce((acc, i) => acc + (i.stock ?? 0), 0) ?? 0;


  const renderCell = (item: any, key: ColumnKey) => {
    switch (key) {
      case 'descripcion':
        return <span className="text-sm text-gray-600 break-words max-w-[18rem]">{item.descripcion ?? '—'}</span>;
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
              <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onPress={() => abrirEditar(item)} key={'editar'}>
                Editar
              </DropdownItem>
              {permisos.puedeEliminar && (
              <DropdownItem onPress={() => eliminar(item.id)} key={'eliminar'}>
                Eliminar
              </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[key];
    }
  };

  const toggleColumn = (key: ColumnKey) =>
    setVisibleColumns((prev) => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });

  
  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            🛠️ Gestión de Productos
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra los productos disponibles.</p>
        </header>

        
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de productos"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              th: 'py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm',
              td: 'align-middle py-3 px-4',
            }}
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
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
                            <DropdownItem key={col.uid}>
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
                      onPress={abrirNuevo}
                    >
                      Nuevo Producto
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {productos.length} productos</span>
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
            }
            bottomContent={
              <div className="py-2 px-2 flex justify-center items-center gap-2">
                <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Pagination isCompact showControls page={page} total={Math.max(pages, 1)} onChange={setPage} />
                <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>
                  Siguiente
                </Button>
              </div>
            }
          >
            <TableHeader columns={columns.filter((c) => visibleColumns.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                  width={col.uid === 'descripcion' ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron productos">
              {(item) => (
                <TableRow key={item.id}>
                  {(colKey) => <TableCell>{renderCell(item, colKey as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

    
        <div className="grid gap-4 md:hidden">
          {sorted.length ? (
            sorted.map((p) => (
              <Card key={p.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{p.nombre}</h3>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                          <MoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem onPress={() => abrirEditar(p)} key={'editar'}>
                          Editar
                        </DropdownItem>
                        <DropdownItem onPress={() => eliminar(p.id)} key={'eliminar'}>
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <p className="text-sm text-gray-600">{p.descripcion ?? 'Sin descripción'}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Categoría:</span> {p.idCategoria?.nombre ?? '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Stock:</span> {totalStock(p.inventarios)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Vencimiento:</span>{' '}
                    {p.fechaVencimiento ? new Date(p.fechaVencimiento).toLocaleDateString() : '—'}
                  </p>
                  <p className="text-xs text-gray-400">ID: {p.id}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No se encontraron productos</p>
          )}
        </div>

      
        <Modal
          isOpen={prodOpen}
          onOpenChange={setProdOpen}
          isDismissable={false}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {() => (
              <>
                <ModalHeader>{editId ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input label="Nombre" value={form.nombre} onValueChange={(v) => setForm((p) => ({ ...p, nombre: v }))} />
                  <Input label="Descripción" value={form.descripcion} onValueChange={(v) => setForm((p) => ({ ...p, descripcion: v }))} />
                  <Input
                    label="Fecha de vencimiento"
                    type="date"
                    value={form.fechaVencimiento}
                    onValueChange={(v) => setForm((p) => ({ ...p, fechaVencimiento: v }))}
                  />
                  
                  <div className="flex items-end gap-2">
                    <Select
                      label="Categoría"
                      className="flex-1"
                      selectedKeys={form.idCategoriaId ? new Set([form.idCategoriaId]) : new Set()}
                      onSelectionChange={(k) =>
                        setForm((p) => ({ ...p, idCategoriaId: Array.from(k)[0] as string }))
                      }
                    >
                      {categorias.map((c) => (
                        <SelectItem key={c.id}>{c.nombre}</SelectItem>
                      ))}
                    </Select>
                  
                    <Button
                      isIconOnly
                      variant="solid"
                      className="bg-[#0D1324] hover:bg-[#1a2133] text-white"
                      onPress={() => setCatOpen()}
                    >
                      <PlusIcon size={18} />
                    </Button>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={() => setProdOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="flat" onPress={guardarProducto}>
                    {editId ? 'Actualizar' : 'Crear'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

      
        <Modal
          isOpen={catOpen}
          onOpenChange={setCatOpen}
          isDismissable={false}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl">
            {() => (
              <>
                <ModalHeader>Nueva Categoría</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input label="Nombre" value={catForm.nombre} onValueChange={(v) => setCatForm((p) => ({ ...p, nombre: v }))} />
                  <Input label="Código UNPSC (opcional)" value={catForm.unpsc} onValueChange={(v) => setCatForm((p) => ({ ...p, unpsc: v }))} />
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={() => setCatOpen()}>
                    Cancelar
                  </Button>
                  <Button variant="flat" onPress={guardarCategoria}>
                    Crear
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
