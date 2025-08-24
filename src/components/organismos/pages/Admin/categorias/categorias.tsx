import { useEffect, useMemo, useState } from "react";
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
  useDisclosure,
  Checkbox,
  type SortDescriptor,
} from "@heroui/react";

import {
  getCategoriasProductos,
  createCategoriaProducto,
  updateCategoriaProducto,
  deleteCategoriaProducto,
} from "@/Api/Categorias";

import DefaultLayout from "@/layouts/default";
import { Plus, MoreVertical, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

import { getDecodedTokenFromCookies } from "@/lib/utils";

const MySwal = withReactContent(Swal);


const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: false },
  { name: "UNPSC", uid: "unpsc", sortable: false },
  { name: "Productos", uid: "productos", sortable: false },
  { name: "Acciones", uid: "actions" },
] as const;

const INITIAL_VISIBLE_COLUMNS = ["id", "nombre", "unpsc", "productos", "actions"] as const;
type ColumnKey = (typeof columns)[number]["uid"];

const CategoriasProductosPage = () => {
   const [categorias, setCategorias] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  // Estados para modal (crear/editar categoría)
  const [nombre, setNombre] = useState("");
  const [unpsc, setUnpsc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });


  const toggleColumn = (uid: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        if (uid === "actions") return prev;
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  };

  
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/categorias-productos&idRol=${rolId}`;
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
        console.error("Error al obtener permisos:", error);
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

  
  const cargarCategorias = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await getCategoriasProductos();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      await MySwal.fire("Error", "Error al cargar categorías", "error");
    }
  };

  
  useEffect(() => {
    cargarCategorias();
  }, [permisos]);


  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para eliminar categorías.", "warning");
      return;
    }

    const result = await MySwal.fire({
      icon: "warning",
      title: "¿Eliminar categoría?",
      text: "No se podrá recuperar.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategoriaProducto(id);
      await MySwal.fire("Eliminado", `Categoría eliminada: ID ${id}`, "success");
      await cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      await MySwal.fire("Error", "Error al eliminar categoría", "error");
    }
  };


  const guardar = async () => {
    if (!nombre.trim()) {
      await MySwal.fire("Aviso", "El nombre es obligatorio", "info");
      return;
    }

    if (editId && !permisos.puedeEditar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para editar categorías.", "warning");
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para crear categorías.", "warning");
      return;
    }

    const payload = { nombre: nombre.trim(), unpsc: unpsc.trim() || undefined };

    try {
      if (editId) {
        await updateCategoriaProducto(editId, payload);
        await MySwal.fire("Éxito", "Categoría actualizada", "success");
      } else {
        await createCategoriaProducto(payload);
        await MySwal.fire("Éxito", "Categoría creada", "success");
      }
      cerrarModal();
      await cargarCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      await MySwal.fire("Error", "Error al guardar categoría", "error");
    }
  };

  
  const abrirModalEditar = (cat: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para editar categorías.", "warning");
      return;
    }
    setEditId(cat.id);
    setNombre(cat.nombre);
    setUnpsc(cat.unpsc || "");
    onOpen();
  };

  
  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para crear categorías.", "warning");
      return;
    }
    setEditId(null);
    setNombre("");
    setUnpsc("");
    onOpen();
  };

  
  const cerrarModal = () => {
    setEditId(null);
    setNombre("");
    setUnpsc("");
    onClose();
  };

  
  const filtered = useMemo(() => {
    if (!filterValue) return categorias;
    const lowerFilter = filterValue.toLowerCase();
    return categorias.filter(
      (c) =>
        c.nombre.toLowerCase().includes(lowerFilter) ||
        (c.unpsc || "").toLowerCase().includes(lowerFilter)
    );
  }, [categorias, filterValue]);

  
  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  
  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  
  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;

    if (!column) return items;

    items.sort((a, b) => {
      const x = a[column as keyof typeof a];
      const y = b[column as keyof typeof b];
      if (x === y) return 0;
      return (x > y ? 1 : -1) * (direction === "ascending" ? 1 : -1);
    });

    return items;
  }, [sliced, sortDescriptor]);

  
  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "nombre":
        return <span className="font-medium text-gray-800">{item.nombre}</span>;

      case "unpsc":
        return <span className="text-sm text-gray-600">{item.unpsc || "—"}</span>;

      case "productos":
        return <span className="text-sm text-gray-600">{item.productos?.length || 0}</span>;

      case "actions":
        const dropdownItems = [];
        if (permisos.puedeEditar) {
          dropdownItems.push(
            <DropdownItem key={`editar-${item.id}`} onPress={() => abrirModalEditar(item)}>
              Editar
            </DropdownItem>
          );
        }
        if (permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)}>
              Eliminar
            </DropdownItem>
          );
        }
        if (!permisos.puedeEditar && !permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem key="sinAcciones" isDisabled>
              Sin acciones disponibles
            </DropdownItem>
          );
        }
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                <MoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>{dropdownItems}</DropdownMenu>
          </Dropdown>
        );

      case "id":
        return <span>{item.id}</span>;

      default:
        return item[columnKey as keyof typeof item] || "—";
    }
  };

  
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
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            📦 Gestión de Categorías de Productos
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra las categorías disponibles.</p>
        </header>

      
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de categorías"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              th: "py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm",
              td: "align-middle py-3 px-4",
            }}
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por nombre o UNPSC"
                    startContent={<Search className="text-[#0D1324]" />}
                    value={filterValue}
                    onValueChange={setFilterValue}
                    onClear={() => setFilterValue("")}
                  />

                  
                  <div className="flex gap-3 items-center">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat">Columnas</Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Seleccionar columnas">
                        {columns
                          .filter((c) => c.uid !== "actions") 
                          .map((col) => (
                            <DropdownItem key={col.uid} className="flex items-center gap-2">
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
                        endContent={<Plus />}
                        onPress={abrirModalNuevo}
                      >
                        Nueva Categoría
                      </Button>
                    )}
                  </div>
                </div>

              
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {categorias.length} categorías</span>
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
          >
            <TableHeader columns={columns.filter((c) => visibleColumns.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === "actions" ? "center" : "start"}
                  width={col.uid === "nombre" ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={sorted} emptyContent="No se encontraron categorías">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        
        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 && <p className="text-center text-gray-500">No se encontraron categorías</p>}
          {sorted.map((cat) => {
          
            const mobileDropdownItems = [];
            if (permisos.puedeEditar) {
              mobileDropdownItems.push(
                <DropdownItem key={`editar-mobile-${cat.id}`} onPress={() => abrirModalEditar(cat)}>
                  Editar
                </DropdownItem>
              );
            }
            if (permisos.puedeEliminar) {
              mobileDropdownItems.push(
                <DropdownItem key={`eliminar-mobile-${cat.id}`} onPress={() => eliminar(cat.id)}>
                  Eliminar
                </DropdownItem>
              );
            }
            if (!permisos.puedeEditar && !permisos.puedeEliminar) {
              mobileDropdownItems.push(
                <DropdownItem key="sinAcciones-mobile" isDisabled>
                  Sin acciones disponibles
                </DropdownItem>
              );
            }

            return (
              <Card key={cat.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg break-words max-w-[14rem]">{cat.nombre}</h3>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="rounded-full text-[#0D1324]">
                          <MoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>{mobileDropdownItems}</DropdownMenu>
                    </Dropdown>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">UNPSC:</span> {cat.unpsc || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Productos:</span> {cat.productos?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">ID: {cat.id}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-md w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? "Editar Categoría" : "Nueva Categoría"}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre de la categoría"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    autoFocus
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Input
                    label="UNPSC (opcional)"
                    placeholder="Código UNPSC"
                    value={unpsc}
                    onValueChange={setUnpsc}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="light" onPress={cerrarModal}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onPress={guardar}
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  >
                    {editId ? "Actualizar" : "Crear"}
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

export default CategoriasProductosPage;
