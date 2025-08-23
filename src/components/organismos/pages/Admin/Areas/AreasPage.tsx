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
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from "@/Api/AreasService";

import DefaultLayout from "@/layouts/default";

import {
  PlusIcon,
  MoreVertical,
  Search,
  Pencil,
  Trash,
} from "lucide-react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

import { getDecodedTokenFromCookies } from "@/lib/utils";

const MySwal = withReactContent(Swal);


const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "nombreArea", sortable: false },
  { name: "Acciones", uid: "actions" },
] as const;

const INITIAL_VISIBLE_COLUMNS = ["id", "nombreArea", "actions"] as const;
type ColumnKey = (typeof columns)[number]["uid"];

const AreasPage = () => {

  const [areas, setAreas] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  
  const [nombre, setNombre] = useState("");
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

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/AreasPage&idRol=${rolId}`;
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

  
  const cargarAreas = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
      await MySwal.fire("Error", "Error al cargar áreas", "error");
    }
  };

  
  useEffect(() => {
    cargarAreas();
  }, [permisos]);

  
  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire(
        "Acceso Denegado",
        "No tienes permisos para eliminar áreas.",
        "warning"
      );
      return;
    }

    const result = await MySwal.fire({
      title: "¿Eliminar área?",
      text: "No se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteArea(id);
      await MySwal.fire("Eliminado", `Área eliminada: ID ${id}`, "success");
      await cargarAreas();
    } catch (error) {
      console.error("Error al eliminar área:", error);
      await MySwal.fire("Error", "Error al eliminar área", "error");
    }
  };

  
  const guardar = async () => {
    if (!nombre.trim()) {
      await MySwal.fire("Aviso", "El nombre es obligatorio", "info");
      return;
    }

    if (editId && !permisos.puedeEditar) {
      await MySwal.fire(
        "Acceso Denegado",
        "No tienes permisos para editar áreas.",
        "warning"
      );
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire(
        "Acceso Denegado",
        "No tienes permisos para crear áreas.",
        "warning"
      );
      return;
    }

    const payload = { nombreArea: nombre.trim() };

    try {
      if (editId) {
        await updateArea(editId, payload);
        await MySwal.fire("Éxito", "Área actualizada", "success");
      } else {
        await createArea(payload);
        await MySwal.fire("Éxito", "Área creada", "success");
      }
      cerrarModal();
      await cargarAreas();
    } catch (error) {
      console.error("Error al guardar área:", error);
      await MySwal.fire("Error", "Error al guardar área", "error");
    }
  };

  
  const abrirModalEditar = (area: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire(
        "Acceso Denegado",
        "No tienes permisos para editar áreas.",
        "warning"
      );
      return;
    }
    setEditId(area.id);
    setNombre(area.nombreArea);
    onOpen();
  };

  
  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire(
        "Acceso Denegado",
        "No tienes permisos para crear áreas.",
        "warning"
      );
      return;
    }
    setEditId(null);
    setNombre("");
    onOpen();
  };

  
  const cerrarModal = () => {
    setEditId(null);
    setNombre("");
    onClose();
  };

  
  const filtered = useMemo(() => {
    if (!filterValue) return areas;
    return areas.filter((a) =>
      (a.nombreArea || "").toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [areas, filterValue]);

  
  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));


  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const sorted = useMemo(() => {
    const items = [...paged];
    const { column, direction } = sortDescriptor;

    if (!column) return items;

    items.sort((a, b) => {
      const x = a[column as keyof typeof a];
      const y = b[column as keyof typeof b];
      if (x === y) return 0;
      return (x > y ? 1 : -1) * (direction === "ascending" ? 1 : -1);
    });

    return items;
  }, [paged, sortDescriptor]);

  
  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "nombreArea":
        return <span className="font-medium text-gray-800">{item.nombreArea || "—"}</span>;

      case "actions":
        const dropdownItems = [];

        if (permisos.puedeEditar) {
          dropdownItems.push(
            <DropdownItem
              key={`editar-${item.id}`}
              onPress={() => abrirModalEditar(item)}
              startContent={<Pencil size={16} />}
            >
              Editar
            </DropdownItem>
          );
        }
        if (permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem
              key={`eliminar-${item.id}`}
              onPress={() => eliminar(item.id)}
              startContent={<Trash size={16} />}
              className="text-danger"
            >
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
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="rounded-full text-[#0D1324]"
              >
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
            <span>Gestión de Áreas</span>
          </h1>
          <p className="text-sm text-gray-600">
            Consulta y administra las áreas disponibles.
          </p>
        </header>

        
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de áreas"
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
                    placeholder="Buscar por nombre"
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
                            <DropdownItem
                              key={col.uid}
                              className="flex items-center gap-2"
                            >
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
                        endContent={<PlusIcon size={18} />}
                        onPress={abrirModalNuevo}
                      >
                        Nueva Área
                      </Button>
                    )}
                  </div>
                </div>

                
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">
                    Total {areas.length} áreas
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
            }
            bottomContent={
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
            }
          >
            <TableHeader columns={columns.filter((c) => visibleColumns.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === "actions" ? "center" : "start"}
                  width={col.uid === "nombreArea" ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={sorted} emptyContent="No se encontraron áreas">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}
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
          isDismissable
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? "Editar Área" : "Nueva Área"}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del área"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    autoFocus
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

export default AreasPage;
