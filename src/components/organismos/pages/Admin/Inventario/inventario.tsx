import { useEffect, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Pagination, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Checkbox, Select, SelectItem, useDisclosure, type SortDescriptor,
} from '@heroui/react';

import {
  getInventarios, createInventario, updateInventario, deleteInventario,
} from '@/Api/inventario';
import { getProductos, createProducto } from '@/Api/Productosform';
import { getSitios, createSitio } from '@/Api/SitioService';
import { getCategoriasProductos } from '@/Api/Categorias';
import { getAreas } from '@/Api/AreasService';
import { getTiposSitio } from '@/Api/Tipo_sitios';

import { getPermisosPorRuta } from '@/Api/getPermisosPorRuta/PermisosService';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import type { InventarioFormValues } from '@/types/types/inventario';
import type { ProductoFormValues } from '@/types/types/typesProductos';
import type { SitioFormValues } from '@/types/types/Sitio';

const primaryBtn =
  'bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow';

// Componente Toast para mostrar mensajes
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 z-50 rounded bg-green-600 px-4 py-2 text-white shadow">
    {message}
  </div>
);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Producto', uid: 'producto' },
  { name: 'Sitio', uid: 'sitio' },
  { name: 'Stock', uid: 'stock', sortable: true },
  { name: 'Acciones', uid: 'actions' },
] as const;
type ColumnKey = (typeof columns)[number]['uid'];
const DEFAULT_VISIBLE = new Set<ColumnKey>(['id', 'producto', 'sitio', 'stock', 'actions']);

const ID_ROL_ACTUAL = 1;

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [sitios, setSitios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [tiposSitio, setTipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [filter, setFilter] = useState('');
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);
  const [rows, setRows] = useState(5);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' });

  const [inv, setInv] = useState({ stock: '', idProductoId: '', fkSitioId: '' });
  const [invId, setInvId] = useState<number | null>(null);
  const invModal = useDisclosure();

  const [prod, setProd] = useState({ nombre: '', descripcion: '', idCategoriaId: '' });
  const prodModal = useDisclosure();

  const [sit, setSit] = useState({ nombre: '', ubicacion: '', idAreaId: '', idTipoSitioId: '' });
  const sitModal = useDisclosure();

  // Estado para mensaje toast
  const [toastMsg, setToastMsg] = useState('');
  const notify = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Permisos
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });
  const [loadingPermisos, setLoadingPermisos] = useState(true);

  useEffect(() => {
    const cargarPermisos = async () => {
      setLoadingPermisos(true);
      try {
        const p = await getPermisosPorRuta('/InventarioPage', ID_ROL_ACTUAL);
        const permisosData = p.data || p;
        setPermisos(permisosData);
        if (permisosData.puedeVer) {
          await cargarDatos();
        }
      } catch (e) {
        setPermisos({ puedeVer: false, puedeCrear: false, puedeEditar: false, puedeEliminar: false });
      } finally {
        setLoadingPermisos(false);
      }
    };
    cargarPermisos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [invD, prodD, sitD, catD, areaD, tipoD] = await Promise.all([
        getInventarios(), getProductos(), getSitios(),
        getCategoriasProductos(), getAreas(), getTiposSitio(),
      ]);
      setInventarios(invD);
      setProductos(prodD);
      setSitios(sitD);
      setCategorias(catD);
      setAreas(areaD);
      setTipos(tipoD);
    } catch (e) {
      console.error('Error cargando datos:', e);
    }
  };

  const saveInv = async () => {
    if (!permisos.puedeCrear && !permisos.puedeEditar) {
      notify('No tienes permiso para guardar');
      return;
    }
    if (!inv.stock || !inv.idProductoId || !inv.fkSitioId) {
      notify('Completa todos los campos');
      return;
    }
    const payload: InventarioFormValues = {
      stock: Number(inv.stock),
      idProductoId: +inv.idProductoId,
      fkSitioId: +inv.fkSitioId,
    };
    try {
      if (invId) {
        if (!permisos.puedeEditar) {
          notify('No tienes permiso para editar');
          return;
        }
        await updateInventario(invId, payload);
        notify('Inventario actualizado');
      } else {
        if (!permisos.puedeCrear) {
          notify('No tienes permiso para crear');
          return;
        }
        await createInventario(payload);
        notify('Inventario creado');
      }
      invModal.onClose();
      setInv({ stock: '', idProductoId: '', fkSitioId: '' });
      setInvId(null);
      setInventarios(await getInventarios());
    } catch {
      notify('Error al guardar inventario');
    }
  };

  const delInv = async (id: number) => {
    if (!permisos.puedeEliminar) {
      notify('No tienes permiso para eliminar');
      return;
    }
    if (!confirm('¿Eliminar registro?')) return;
    try {
      await deleteInventario(id);
      notify('Inventario eliminado');
      setInventarios(await getInventarios());
    } catch {
      notify('Error al eliminar inventario');
    }
  };

  const saveProd = async () => {
    if (!prod.nombre || !prod.idCategoriaId) {
      notify('Nombre y categoría requeridos');
      return;
    }
    const payload: ProductoFormValues = {
      nombre: prod.nombre,
      descripcion: prod.descripcion || null,
      idCategoriaId: +prod.idCategoriaId,
    };
    try {
      const nuevo = await createProducto(payload);
      setProductos(await getProductos());
      setInv(f => ({ ...f, idProductoId: String(nuevo.id) }));
      prodModal.onClose();
      setProd({ nombre: '', descripcion: '', idCategoriaId: '' });
      notify('Producto creado');
    } catch {
      notify('Error al crear producto');
    }
  };

  const saveSit = async () => {
    if (!sit.nombre || !sit.ubicacion || !sit.idAreaId || !sit.idTipoSitioId) {
      notify('Completa todos los campos');
      return;
    }
    const payload: SitioFormValues = {
      nombre: sit.nombre,
      ubicacion: sit.ubicacion,
      idArea: { id: +sit.idAreaId },
      idTipoSitio: { id: +sit.idTipoSitioId },
    };
    try {
      const nuevo = await createSitio(payload);
      setSitios(await getSitios());
      setInv(f => ({ ...f, fkSitioId: String(nuevo.id) }));
      sitModal.onClose();
      setSit({ nombre: '', ubicacion: '', idAreaId: '', idTipoSitioId: '' });
      notify('Sitio creado');
    } catch {
      notify('Error al crear sitio');
    }
  };

  const filtered = useMemo(() => {
    if (!filter) return inventarios;
    return inventarios.filter(i =>
      `${i.idProducto?.nombre ?? ''} ${i.fkSitio?.nombre ?? ''}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }, [inventarios, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  const list = useMemo(() => {
    const slice = filtered.slice((page - 1) * rows, page * rows);
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return [...slice].sort((a, b) => {
      const xa = sort.column === 'id' ? a.idProductoInventario : a[sort.column];
      const xb = sort.column === 'id' ? b.idProductoInventario : b[sort.column];
      return xa === xb ? 0 : xa > xb ? dir : -dir;
    });
  }, [filtered, page, rows, sort]);

  const cell = (row: any, key: ColumnKey) => {
    switch (key) {
      case 'id': return row.idProductoInventario;
      case 'producto': return row.idProducto?.nombre ?? '—';
      case 'sitio': return row.fkSitio?.nombre ?? '—';
      case 'stock': return row.stock;
      case 'actions':
        if (!permisos.puedeEditar && !permisos.puedeEliminar) return null;
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {permisos.puedeEditar ? (
                <DropdownItem
                  onPress={() => {
                    setInvId(row.idProductoInventario);
                    setInv({
                      stock: row.stock.toString(),
                      idProductoId: row.idProducto?.id.toString() || '',
                      fkSitioId: row.fkSitio?.id.toString() || '',
                    });
                    invModal.onOpen();
                  }}
                  key={`editar-${row.idProductoInventario}`}
                >
                  Editar
                </DropdownItem>
              ) : null}
              {permisos.puedeEliminar ? (
                <DropdownItem onPress={() => delInv(row.idProductoInventario)} key={`eliminar-${row.idProductoInventario}`}>
                  Eliminar
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return row[key];
    }
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisible(v => {
      const newSet = new Set(v);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  if (loadingPermisos) {
    return (
      <DefaultLayout>
        <div className="p-6 flex justify-center items-center h-64">
          <span className="text-gray-500 text-lg">Cargando permisos...</span>
        </div>
      </DefaultLayout>
    );
  }

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6">
          <div className="bg-red-100 text-red-700 p-4 rounded shadow text-center">
            No tienes permiso para ver esta página.
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <Input
          radius="lg"
          isClearable
          value={filter}
          placeholder="Buscar por producto o sitio"
          startContent={<SearchIcon className="text-[#0D1324]" />}
          onValueChange={setFilter}
          onClear={() => setFilter('')}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger><Button variant="flat">Columnas</Button></DropdownTrigger>
            <DropdownMenu>
              {columns.filter(c => c.uid !== 'actions').map(c => (
                <DropdownItem key={c.uid}>
                  <Checkbox size="sm" isSelected={visible.has(c.uid)} onValueChange={() => toggleColumn(c.uid)}>
                    {c.name}
                  </Checkbox>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {permisos.puedeCrear ? (
            <Button
              className={primaryBtn}
              endContent={<PlusIcon />}
              onPress={() => {
                setInv({ stock: '', idProductoId: '', fkSitioId: '' });
                setInvId(null);
                invModal.onOpen();
              }}
            >
              Nuevo Inventario
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-default-400">Total {inventarios.length} registros</span>
        <label className="flex items-center text-sm text-default-400">
          Filas:&nbsp;
          <select
            value={rows}
            onChange={e => {
              setRows(+e.target.value);
              setPage(1);
            }}
            className="ml-1 bg-transparent outline-none text-default-600"
          >
            {[5, 10, 15].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      {toastMsg && <Toast message={toastMsg} />}

      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📦 Gestión de Inventario
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra stock por sitio y producto.</p>
        </header>

        <div className="hidden md:block overflow-x-auto rounded-xl bg-white shadow-sm">
          <Table
            aria-label="Inventario"
            isHeaderSticky
            topContent={topContent}
            bottomContent={
              <div className="flex items-center justify-center gap-2 p-2">
                <Button size="sm" variant="flat" disabled={page === 1} onPress={() => setPage(p => p - 1)}>
                  Anterior
                </Button>
                <Pagination isCompact page={page} total={totalPages} onChange={setPage} showControls />
                <Button size="sm" variant="flat" disabled={page === totalPages} onPress={() => setPage(p => p + 1)}>
                  Siguiente
                </Button>
              </div>
            }
            sortDescriptor={sort}
            onSortChange={setSort}
            classNames={{ th: 'bg-[#e8ecf4] py-3 px-4 text-sm font-semibold text-[#0D1324]', td: 'py-3 px-4 align-middle' }}
          >
            <TableHeader columns={columns.filter(c => visible.has(c.uid))}>
              {col => (
                <TableColumn key={col.uid} align={col.uid === 'actions' ? 'center' : 'start'}>
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={list} emptyContent="No se encontraron registros">
              {row => (
                <TableRow key={row.idProductoInventario}>
                  {key => <TableCell>{cell(row, key as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {list.length ? (
            list.map(i => (
              <Card key={i.idProductoInventario} className="shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold break-words">{i.idProducto?.nombre ?? 'Producto'}</h3>
                    {(permisos.puedeEditar || permisos.puedeEliminar) ? (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" size="sm" className="rounded-full text-[#0D1324]">
                            <MoreVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          {permisos.puedeEditar ? (
                            <DropdownItem
                              onPress={() => {
                                setInvId(i.idProductoInventario);
                                setInv({
                                  stock: i.stock.toString(),
                                  idProductoId: i.idProducto?.id.toString() || '',
                                  fkSitioId: i.fkSitio?.id.toString() || '',
                                });
                                invModal.onOpen();
                              }}
                              key={`editar-${i.idProductoInventario}`}
                            >
                              Editar
                            </DropdownItem>
                          ) : null}
                          {permisos.puedeEliminar ? (
                            <DropdownItem
                              onPress={() => delInv(i.idProductoInventario)}
                              key={`eliminar-${i.idProductoInventario}`}
                            >
                              Eliminar
                            </DropdownItem>
                          ) : null}
                        </DropdownMenu>
                      </Dropdown>
                    ) : null}
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

        {/* Modal Inventario */}
        <Modal isOpen={invModal.isOpen} onOpenChange={o => o || invModal.onClose()} isDismissable={false} placement="center">
          <ModalContent className="backdrop-blur bg-white/60 rounded-xl shadow-xl">
            <ModalHeader>{invId ? 'Editar Inventario' : 'Nuevo Inventario'}</ModalHeader>
            <ModalBody className="space-y-4">
              <Input label="Stock" type="number" min={0} value={inv.stock} onValueChange={v => setInv(f => ({ ...f, stock: v }))} />
              <div className="flex items-end gap-2">
                <Select label="Producto" className="flex-1" selectedKeys={inv.idProductoId ? new Set([inv.idProductoId]) : new Set()} onSelectionChange={k => setInv(f => ({ ...f, idProductoId: [...k][0] as string }))}>
                  {productos.map(p => <SelectItem key={p.id}>{p.nombre}</SelectItem>)}
                </Select>
                <Button isIconOnly variant="flat" className={primaryBtn} onPress={prodModal.onOpen}>
                  <PlusIcon size={18} />
                </Button>
              </div>
              <div className="flex items-end gap-2">
                <Select label="Sitio" className="flex-1" selectedKeys={inv.fkSitioId ? new Set([inv.fkSitioId]) : new Set()} onSelectionChange={k => setInv(f => ({ ...f, fkSitioId: [...k][0] as string }))}>
                  {sitios.map(s => <SelectItem key={s.id}>{s.nombre}</SelectItem>)}
                </Select>
                <Button isIconOnly variant="flat" className={primaryBtn} onPress={sitModal.onOpen}>
                  <PlusIcon size={18} />
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={invModal.onClose}>Cancelar</Button>
              <Button variant="flat" onPress={saveInv}>{invId ? 'Actualizar' : 'Crear'}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Producto */}
        <Modal isOpen={prodModal.isOpen} onOpenChange={o => o || prodModal.onClose()} isDismissable={false} placement="center">
          <ModalContent className="backdrop-blur bg-white/60 rounded-xl shadow-xl">
            <ModalHeader>Nuevo Producto</ModalHeader>
            <ModalBody className="space-y-4">
              <Input label="Nombre" value={prod.nombre} onValueChange={v => setProd(p => ({ ...p, nombre: v }))} />
              <Input label="Descripción (opcional)" value={prod.descripcion} onValueChange={v => setProd(p => ({ ...p, descripcion: v }))} />
              <Select label="Categoría" selectedKeys={prod.idCategoriaId ? new Set([prod.idCategoriaId]) : new Set()} onSelectionChange={k => setProd(p => ({ ...p, idCategoriaId: [...k][0] as string }))}>
                {categorias.map(c => <SelectItem key={c.id}>{c.nombre}</SelectItem>)}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={prodModal.onClose}>Cancelar</Button>
              <Button variant="flat" onPress={saveProd}>Crear</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Sitio */}
        <Modal isOpen={sitModal.isOpen} onOpenChange={o => o || sitModal.onClose()} isDismissable={false} placement="center">
          <ModalContent className="backdrop-blur bg-white/60 rounded-xl shadow-xl">
            <ModalHeader>Nuevo Sitio</ModalHeader>
            <ModalBody className="space-y-4">
              <Input label="Nombre" value={sit.nombre} onValueChange={v => setSit(s => ({ ...s, nombre: v }))} />
              <Input label="Ubicación" value={sit.ubicacion} onValueChange={v => setSit(s => ({ ...s, ubicacion: v }))} />
              <Select label="Área" selectedKeys={sit.idAreaId ? new Set([sit.idAreaId]) : new Set()} onSelectionChange={k => setSit(s => ({ ...s, idAreaId: [...k][0] as string }))}>
                {areas.map(a => <SelectItem key={a.id}>{a.nombreArea}</SelectItem>)}
              </Select>
              <Select label="Tipo de Sitio" selectedKeys={sit.idTipoSitioId ? new Set([sit.idTipoSitioId]) : new Set()} onSelectionChange={k => setSit(s => ({ ...s, idTipoSitioId: [...k][0] as string }))}>
                {tiposSitio.map(t => <SelectItem key={t.id}>{t.nombre}</SelectItem>)}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={sitModal.onClose}>Cancelar</Button>
              <Button variant="flat" onPress={saveSit}>Crear</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}
