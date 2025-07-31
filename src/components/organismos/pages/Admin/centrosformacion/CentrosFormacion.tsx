// src/pages/CentrosFormacionPage.tsx
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
  Checkbox,
  Select,
  SelectItem,
  type SortDescriptor,
} from "@heroui/react";

import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from "@/Api/centrosformacionTable";

import { obtenerMunicipios } from "@/Api/MunicipiosForm";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, MoreVertical, Search as SearchIcon } from "lucide-react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { getDecodedTokenFromCookies } from "@/lib/utils";

const MySwal = withReactContent(Swal);

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: false },
  { name: "Ubicación", uid: "ubicacion", sortable: false },
  { name: "Teléfono", uid: "telefono", sortable: false },
  { name: "Email", uid: "email", sortable: false },
  { name: "Municipio", uid: "municipio", sortable: false },
  { name: "# Sedes", uid: "sedes", sortable: false },
  { name: "Acciones", uid: "actions" },
] as const;

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nombre",
  "ubicacion",
  "telefono",
  "email",
  "municipio",
  "sedes",
  "actions",
] as const;

type ColumnKey = (typeof columns)[number]["uid"];

const CentrosFormacionPage = () => {
  const [centros, setCentros] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para permisos
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  // Cargar permisos al montar
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        // Asegúrate que esta es la ruta correcta para los permisos de centros formación:
        const url = `http://localhost:3000/permisos/por-ruta?ruta=/CentrosFormaciones&idRol=${rolId}`;
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

  // Cargar datos solo si puedeVer
  const cargarCentros = async () => {
    if (!permisos.puedeVer) return;
    try {
      const data = await getCentrosFormacion();
      setCentros(data);
    } catch (error) {
      console.error("Error cargando centros:", error);
      await MySwal.fire("Error", "Error cargando centros", "error");
    }
  };

  // Cargar municipios (sin restricción normalmente)
  const cargarMunicipios = async () => {
    try {
      const data = await obtenerMunicipios();
      setMunicipios(data);
    } catch (error) {
      console.error("Error cargando municipios:", error);
      await MySwal.fire("Error", "Error cargando municipios", "error");
    }
  };

  // Recarga al cambiar permisos
  useEffect(() => {
    cargarCentros();
  }, [permisos]);

  useEffect(() => {
    cargarMunicipios();
  }, []);

  // CRUD con validación de permisos
  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para eliminar centros.", "warning");
      return;
    }
    const result = await MySwal.fire({
      title: "¿Eliminar centro?",
      text: "No se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCentroFormacion(id);
      await MySwal.fire("Eliminado", `Centro eliminado: ID ${id}`, "success");
      await cargarCentros();
    } catch (error) {
      console.error("Error eliminando centro:", error);
      await MySwal.fire("Error", "Error eliminando centro", "error");
    }
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      await MySwal.fire("Aviso", "El nombre es obligatorio", "info");
      return;
    }

    if (!idMunicipio) {
      await MySwal.fire("Aviso", "Debe seleccionar un municipio", "info");
      return;
    }

    if (editId !== null && !permisos.puedeEditar) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para editar centros.", "warning");
      return;
    }
    if (editId === null && !permisos.puedeCrear) {
      await MySwal.fire("Acceso Denegado", "No tienes permisos para crear centros.", "warning");
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      idMunicipio: { id: parseInt(idMunicipio, 10) },
    };

    try {
      if (editId !== null) {
        await updateCentroFormacion(editId, payload);
        await MySwal.fire("Éxito", "Centro actualizado", "success");
      } else {
        await createCentroFormacion(payload);
        await MySwal.fire("Éxito", "Centro creado", "success");
      }
      setIsModalOpen(false);
      limpiarFormulario();
      await cargarCentros();
    } catch (error) {
      console.error("Error guardando centro:", error);
      await MySwal.fire("Error", "Error guardando centro", "error");
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setUbicacion("");
    setTelefono("");
    setEmail("");
    setIdMunicipio("");
    setEditId(null);
  };

  const abrirModalEditar = (c: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para editar centros.", "warning");
      return;
    }
    setEditId(c.id);
    setNombre(c.nombre || "");
    setUbicacion(c.ubicacion || "");
    setTelefono(c.telefono || "");
    setEmail(c.email || "");
    setIdMunicipio(c.idMunicipio?.id?.toString() || "");
    setIsModalOpen(true);
  };

  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para crear centros.", "warning");
      return;
    }
    limpiarFormulario();
    setIsModalOpen(true);
  };

  // Filtro
  const filtered = useMemo(() => {
    if (!filterValue) return centros;
    const lowerFilter = filterValue.toLowerCase();
    return centros.filter((c) =>
      `${c.nombre} ${c.ubicacion} ${c.email} ${c.idMunicipio?.nombre || ""}`.toLowerCase().includes(lowerFilter)
    );
  }, [centros, filterValue]);

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

  // Render celdas con control de permisos en acciones
  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "nombre":
        return (
          <span className="font-medium text-gray-800 capitalize break-words max-w-[16rem]">
            {item.nombre}
          </span>
        );
      case "ubicacion":
        return <span className="text-sm text-gray-600">{item.ubicacion}</span>;
      case "telefono":
        return <span className="text-sm text-gray-600">{item.telefono}</span>;
      case "email":
        return <span className="text-sm text-gray-600">{item.email}</span>;
      case "municipio":
        return <span className="text-sm text-gray-600">{item.idMunicipio?.nombre || "—"}</span>;
      case "sedes":
        return <span className="text-sm text-gray-600">{item.sedes?.length || 0}</span>;
      case "actions": {
        const dropdownItems = [];
        if (permisos.puedeEditar) {
          dropdownItems.push(
            <DropdownItem onPress={() => abrirModalEditar(item)} key={`editar-${item.id}`}>
              Editar
            </DropdownItem>
          );
        }
        if (permisos.puedeEliminar) {
          dropdownItems.push(
            <DropdownItem onPress={() => eliminar(item.id)} key={`eliminar-${item.id}`}>
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
      }
      default:
        return item[columnKey as keyof typeof item];
    }
  };

  // Toggle columnas visibles
  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  // Mensaje si no puede ver nada
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
            🏫 Gestión de Centros de Formación
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra los centros disponibles.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de centros"
            isHeaderSticky
            topContent={
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
                    onClear={() => setFilterValue("")}
                  />
                  <div className="flex gap-3">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat">Columnas</Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Seleccionar columnas">
                        {columns
                          .filter((c) => c.uid !== "actions")
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
                    {permisos.puedeCrear && (
                      <Button
                        className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
                        endContent={<PlusIcon />}
                        onPress={abrirModalNuevo}
                      >
                        Nuevo Centro
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-400 text-sm">Total {centros.length} centros</span>
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
                  width={col.uid === "nombre" ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron centros">
              {(item) => (
                <TableRow key={item.id}>
                  {(col) => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            if (!open) setIsModalOpen(false);
          }}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable={false}
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-lg w-full p-6">
            {() => (
              <>
                <ModalHeader>{editId ? "Editar Centro" : "Nuevo Centro"}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del centro"
                    value={nombre}
                    onValueChange={setNombre}
                    radius="sm"
                    autoFocus
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Input
                    label="Ubicación"
                    placeholder="Dirección o ubicación"
                    value={ubicacion}
                    onValueChange={setUbicacion}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Input
                    label="Teléfono"
                    placeholder="Teléfono de contacto"
                    value={telefono}
                    onValueChange={setTelefono}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Input
                    label="Email"
                    placeholder="Correo electrónico"
                    value={email}
                    onValueChange={setEmail}
                    radius="sm"
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <Select
                    label="Municipio"
                    radius="sm"
                    selectedKeys={idMunicipio ? new Set([idMunicipio]) : new Set()}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0];
                      setIdMunicipio(val ? String(val) : "");
                    }}
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  >
                    {municipios.map((m) => (
                      <SelectItem key={String(m.id)}>{m.nombre}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="light" onPress={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="flat"
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

export default CentrosFormacionPage;
