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
  getEntregasMaterial,
  createEntregaMaterial,
  updateEntregaMaterial,
  deleteEntregaMaterial,
} from "@/Api/entregaMaterial";

import { getFichasFormacion } from "@/Api/fichasFormacion";
import { getSolicitudes } from "@/Api/Solicitudes";
import { getUsuarios } from "@/Api/Usuariosform";

import DefaultLayout from "@/layouts/default";
import { PlusIcon, MoreVertical, Search as SearchIcon } from "lucide-react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "@/Api/axios"; 
import { getDecodedTokenFromCookies } from "@/lib/utils";

const MySwal = withReactContent(Swal);

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Fecha", uid: "fechaEntrega", sortable: false },
  { name: "Observaciones", uid: "observaciones", sortable: false },
  { name: "Ficha", uid: "ficha", sortable: false },
  { name: "Solicitud", uid: "solicitud", sortable: false },
  { name: "Responsable", uid: "responsable", sortable: false },
  { name: "Acciones", uid: "actions" },
] as const;

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "fechaEntrega",
  "observaciones",
  "ficha",
  "solicitud",
  "responsable",
  "actions",
] as const;

type ColumnKey = (typeof columns)[number]["uid"];

const EntregaMaterialPage = () => {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");

  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const [fechaEntrega, setFechaEntrega] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idFicha, setIdFicha] = useState<number | "">("");
  const [idSolicitud, setIdSolicitud] = useState<number | "">("");
  const [idResponsable, setIdResponsable] = useState<number | "">("");
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

        const url = `/permisos/por-ruta?ruta=/entrega-material&idRol=${rolId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });
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

  useEffect(() => {
    if (!permisos.puedeVer) return;
    cargarDatos();
  }, [permisos]);

  const cargarDatos = async () => {
    try {
      const [ents, fich, sols, usrs] = await Promise.all([
        getEntregasMaterial(),
        getFichasFormacion(),
        getSolicitudes(),
        getUsuarios(),
      ]);
      setEntregas(ents);
      setFichas(fich);
      setSolicitudes(sols);
      setUsuarios(usrs);
    } catch (err) {
      console.error("Error cargando datos", err);
      await MySwal.fire("Error", "Error cargando datos", "error");
    }
  };

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para eliminar.", "warning");
      return;
    }
    const result = await MySwal.fire({
      title: "¿Eliminar entrega?",
      text: "No se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteEntregaMaterial(id);
      await MySwal.fire("Eliminado", `Entrega eliminada: ID ${id}`, "success");
      await cargarDatos();
    } catch (e) {
      console.error(e);
      await MySwal.fire("Error", "Error eliminando entrega", "error");
    }
  };

  const guardar = async () => {
    if (!fechaEntrega || !idFicha || !idSolicitud || !idResponsable) {
      await MySwal.fire("Error", "Completa todos los campos obligatorios", "error");
      return;
    }

    if (editId && !permisos.puedeEditar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para editar entregas.", "warning");
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para crear entregas.", "warning");
      return;
    }

    const payload = {
      fechaEntrega,
      observaciones: observaciones || null,
      idFichaFormacion: { id: Number(idFicha) },
      idSolicitud: { id: Number(idSolicitud) },
      idUsuarioResponsable: { id: Number(idResponsable) },
    };

    try {
      if (editId) {
        await updateEntregaMaterial(editId, payload);
        await MySwal.fire("Éxito", "Entrega actualizada", "success");
      } else {
        await createEntregaMaterial(payload);
        await MySwal.fire("Éxito", "Entrega creada", "success");
      }
      onClose();
      limpiarFormulario();
      await cargarDatos();
    } catch (e) {
      console.error(e);
      await MySwal.fire("Error", "Error guardando entrega", "error");
    }
  };

  const abrirModalEditar = (item: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para editar.", "warning");
      return;
    }
    setEditId(item.id);
    setFechaEntrega(item.fechaEntrega);
    setObservaciones(item.observaciones || "");
    setIdFicha(item.idFichaFormacion?.id || "");
    setIdSolicitud(item.idSolicitud?.id || "");
    setIdResponsable(item.idUsuarioResponsable?.id || "");
    onOpen();
  };

  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para crear.", "warning");
      return;
    }
    limpiarFormulario();
    onOpen();
  };

  const limpiarFormulario = () => {
    setEditId(null);
    setFechaEntrega("");
    setObservaciones("");
    setIdFicha("");
    setIdSolicitud("");
    setIdResponsable("");
  };

  const filtered = useMemo(() => {
    if (!filterValue) return entregas;
    const lowerFilter = filterValue.toLowerCase();
    return entregas.filter((e) =>
      `${e.fechaEntrega} ${e.observaciones || ""} ${e.idFichaFormacion?.nombre || ""} ${e.idSolicitud?.estadoSolicitud || ""} ${
        e.idUsuarioResponsable?.nombre || ""
      }`
        .toLowerCase()
        .includes(lowerFilter)
    );
  }, [entregas, filterValue]);

  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

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
      if (x === y) return 0;
      return (x > y ? 1 : -1) * (direction === "ascending" ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "fechaEntrega":
        return <span className="text-sm text-gray-800">{item.fechaEntrega}</span>;
      case "observaciones":
        return <span className="text-sm text-gray-600 break-words max-w-[16rem]">{item.observaciones || "—"}</span>;
      case "ficha":
        return <span className="text-sm text-gray-600">{item.idFichaFormacion?.nombre || "—"}</span>;
      case "solicitud":
        return <span className="text-sm text-gray-600">{item.idSolicitud?.estadoSolicitud || "—"}</span>;
      case "responsable":
        return (
          <span className="text-sm text-gray-600">
            {item.idUsuarioResponsable ? `${item.idUsuarioResponsable.nombre} ${item.idUsuarioResponsable.apellido || ""}` : "—"}
          </span>
        );
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
            <DropdownItem key={`eliminar-${item.id}`} onPress={() => eliminar(item.id)} className="text-danger">
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
            📦 Entrega de Material
          </h1>
          <p className="text-sm text-gray-600">Registra y gestiona las entregas a programas y solicitudes.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de entregas"
            isHeaderSticky
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <Input
                    isClearable
                    className="w-full md:max-w-[44%]"
                    radius="lg"
                    placeholder="Buscar por ficha, solicitud o responsable"
                    startContent={<SearchIcon className="text-[#0D1324]" />}
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
                        endContent={<PlusIcon />}
                        onPress={abrirModalNuevo}
                      >
                        Nueva Entrega
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {entregas.length} entregas</span>
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
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              th: "py-3 px-4 bg-[#e8ecf4] text-[#0D1324] font-semibold text-sm",
              td: "align-middle py-3 px-4",
            }}
          >
            <TableHeader columns={columns.filter((c) => visibleColumns.has(c.uid))}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === "actions" ? "center" : "start"}
                  width={col.uid === "observaciones" ? 300 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron entregas">
              {(item) => (
                <TableRow key={item.id}>{(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}</TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="backdrop-blur-sm bg-black/30" isDismissable>
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? "Editar Entrega" : "Nueva Entrega"}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Fecha de entrega (YYYY-MM-DD)"
                    placeholder="2025-06-22"
                    value={fechaEntrega}
                    onValueChange={setFechaEntrega}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Input
                    label="Observaciones"
                    placeholder="Observaciones (opcional)"
                    value={observaciones}
                    onValueChange={setObservaciones}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Ficha Formación
                    </label>
                    <select
                      value={idFicha}
                      onChange={(e) => setIdFicha(Number(e.target.value) || "")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="">Seleccione una ficha</option>
                      {fichas.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Solicitud</label>
                    <select
                      value={idSolicitud}
                      onChange={(e) => setIdSolicitud(Number(e.target.value) || "")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="">Seleccione una solicitud</option>
                      {solicitudes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {`${s.id} - ${s.estadoSolicitud}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Responsable</label>
                    <select
                      value={idResponsable}
                      onChange={(e) => setIdResponsable(Number(e.target.value) || "")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="">Seleccione un responsable</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {`${u.nombre} ${u.apellido}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button
                    variant="light"
                    onPress={() => {
                      limpiarFormulario();
                      onClose();
                    }}
                  >
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

export default EntregaMaterialPage;
