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

import { obtenerMunicipios, crearMunicipio } from "@/Api/MunicipiosForm";

import DefaultLayout from "@/layouts/default";
import { PlusIcon, MoreVertical, Search as SearchIcon } from "lucide-react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { getDecodedTokenFromCookies } from "@/lib/utils";

const MySwal = withReactContent(Swal);

// Columnas definidas para la tabla
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: false },
  { name: "Ubicación", uid: "ubicacion", sortable: false },
  { name: "Teléfono", uid: "telefono", sortable: false },
  { name: "Email", uid: "email", sortable: false },
  { name: "Municipio", uid: "municipio", sortable: false },
  { name: "Sedes", uid: "sedes", sortable: false },
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
  // Estados principales
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

  // Estados formulario centro formación (crear/editar)
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Control modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMunicipioModalOpen, setIsMunicipioModalOpen] = useState(false);

  // Estados formulario nuevo municipio
  const [municipioNombre, setMunicipioNombre] = useState("");
  const [municipioDepartamento, setMunicipioDepartamento] = useState("");
  const [savingMunicipio, setSavingMunicipio] = useState(false);

  // Permisos usuario
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  // Función para alternar columnas visibles (acciones siempre visible)
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

  // Obtener permisos al montar componente
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;
        if (!rolId) return;

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

  // Cargar centros y municipios según permisos y montaje
  useEffect(() => {
    if (permisos.puedeVer) cargarCentros();
  }, [permisos]);

  useEffect(() => {
    cargarMunicipios();
  }, []);

  // Función para cargar centros de formación
  const cargarCentros = async () => {
    try {
      const data = await getCentrosFormacion();
      setCentros(data);
    } catch (error) {
      console.error("Error cargando centros:", error);
      await MySwal.fire("Error", "Error cargando centros", "error");
    }
  };

  // Función para cargar municipios
  const cargarMunicipios = async () => {
    try {
      const data = await obtenerMunicipios();
      setMunicipios(data);
    } catch (error) {
      console.error("Error cargando municipios:", error);
      await MySwal.fire("Error", "Error cargando municipios", "error");
    }
  };

  // Eliminar centro con confirmación y validación de permisos
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
    } catch {
      await MySwal.fire("Error", "Error eliminando centro", "error");
    }
  };

  // Guardar centro (nuevo o editar) con validación
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
    } catch {
      await MySwal.fire("Error", "Error guardando centro", "error");
    }
  };

  // Guardar nuevo municipio
  const guardarMunicipio = async () => {
    if (!municipioNombre.trim()) {
      await MySwal.fire("Aviso", "El nombre del municipio es obligatorio", "info");
      return;
    }
    if (!municipioDepartamento.trim()) {
      await MySwal.fire("Aviso", "El departamento del municipio es obligatorio", "info");
      return;
    }
    setSavingMunicipio(true);
    try {
      await crearMunicipio({
        nombre: municipioNombre.trim(),
        departamento: municipioDepartamento.trim(),
      });
      await MySwal.fire("Éxito", "Municipio creado", "success");
      setIsMunicipioModalOpen(false);
      setMunicipioNombre("");
      setMunicipioDepartamento("");
      const lista = await obtenerMunicipios();
      setMunicipios(lista);

      // Seleccionar el municipio recién creado automáticamente
      const creado = lista.find(
        (m) =>
          m.nombre?.toLowerCase() === municipioNombre.trim().toLowerCase() &&
          m.departamento?.toLowerCase() === municipioDepartamento.trim().toLowerCase()
      );
      if (creado) setIdMunicipio(String(creado.id));
    } catch (error) {
      await MySwal.fire("Error", "Error creando municipio", "error");
    } finally {
      setSavingMunicipio(false);
    }
  };

  // Limpiar formulario centro
  const limpiarFormulario = () => {
    setNombre("");
    setUbicacion("");
    setTelefono("");
    setEmail("");
    setIdMunicipio("");
    setEditId(null);
  };

  // Abrir modal editar centro precargando datos
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

  // Abrir modal nuevo centro
  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire("Acceso Denegado", "No tienes permisos para crear centros.", "warning");
      return;
    }
    limpiarFormulario();
    setIsModalOpen(true);
  };

  // Filtrado de centros
  const filtered = useMemo(() => {
    if (!filterValue) return centros;
    const lowerFilter = filterValue.toLowerCase();
    return centros.filter((c) =>
      `${c.nombre} ${c.ubicacion} ${c.email} ${c.idMunicipio?.nombre || ""}`
        .toLowerCase()
        .includes(lowerFilter)
    );
  }, [centros, filterValue]);

  // Paginación calculada
  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // Ordenamiento
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

  // Renderizado celdas con acciones segun permisos
  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "nombre":
        return (
          <span className="font-medium text-gray-800 capitalize break-words max-w-[16rem]">
            {item.nombre}
          </span>
        );
      case "ubicacion":
        return <span className="text-sm text-gray-600">{item.ubicacion || "—"}</span>;
      case "telefono":
        return <span className="text-sm text-gray-600">{item.telefono || "—"}</span>;
      case "email":
        return <span className="text-sm text-gray-600">{item.email || "—"}</span>;
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
        return item[columnKey as keyof typeof item] || "—";
    }
  };

  // Mensaje al usuario si no tiene permiso para ver el contenido
  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  // Renderizado principal
  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">
            🏫 Gestión de Centros de Formación
          </h1>
          <p className="text-sm text-gray-600">Consulta y administra los centros disponibles.</p>
        </header>

        {/* Tabla Desktop */}
        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de centros"
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
                  {/* Input búsqueda */}
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

                  {/* Dropdown columna + botón nuevo */}
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

                {/* Pagina y filas por página */}
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

        {/* Modal crear/editar centro formación */}
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
                  {/* Select municipio y botón para crear municipio */}
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
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
                    </div>
                    <Button
                      aria-label="Agregar municipio"
                      size="sm"
                      variant="flat"
                      className="min-w-[2.5rem] h-9 flex items-center justify-center bg-[#0D1324] text-white hover:bg-[#1a2133]"
                      onPress={() => setIsMunicipioModalOpen(true)}
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
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

        {/* Modal crear nuevo municipio */}
        <Modal
          isOpen={isMunicipioModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsMunicipioModalOpen(false);
              setMunicipioNombre("");
              setMunicipioDepartamento("");
            }
          }}
          placement="center"
          className="backdrop-blur-sm bg-black/30"
          isDismissable={false}
        >
          <ModalContent className="backdrop-blur bg-white/60 shadow-xl rounded-xl max-w-md w-full p-6">
            <ModalHeader>Nuevo Municipio</ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Nombre"
                placeholder="Nombre del municipio"
                value={municipioNombre}
                onValueChange={setMunicipioNombre}
                radius="sm"
                autoFocus
                disabled={savingMunicipio}
              />
              <Input
                label="Departamento"
                placeholder="Departamento"
                value={municipioDepartamento}
                onValueChange={setMunicipioDepartamento}
                radius="sm"
                disabled={savingMunicipio}
              />
            </ModalBody>
            <ModalFooter className="flex justify-end gap-3">
              <Button
                variant="light"
                onPress={() => setIsMunicipioModalOpen(false)}
                disabled={savingMunicipio}
              >
                Cancelar
              </Button>
              <Button variant="flat" onPress={guardarMunicipio} disabled={savingMunicipio}>
                Guardar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CentrosFormacionPage;
