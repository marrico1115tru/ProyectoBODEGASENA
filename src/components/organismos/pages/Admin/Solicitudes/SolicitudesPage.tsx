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
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from '@/Api/Solicitudes';
import { getUsuarios } from '@/Api/Usuariosform';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { getDecodedTokenFromCookies } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Fecha', uid: 'fecha', sortable: true },
  { name: 'Estado', uid: 'estado', sortable: false },
  { name: 'Solicitante', uid: 'solicitante', sortable: false },
  { name: '# Detalles', uid: 'detalles', sortable: false },
  { name: '# Entregas', uid: 'entregas', sortable: false },
  { name: 'Acciones', uid: 'actions' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'fecha',
  'estado',
  'solicitante',
  'detalles',
  'entregas',
  'actions',
] as const;

type ColumnKey = (typeof columns)[number]['uid'];

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set<string>(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [estado, setEstado] = useState<'PENDIENTE' | 'APROBADA' | 'RECHAZADA'>('PENDIENTE');
  const [idSolicitante, setIdSolicitante] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/solicitudes&idRol=${rolId}`;
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
        console.error('Error al obtener permisos:', error);
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

  const cargarDatos = async () => {
    if (!permisos.puedeVer) return;
    try {
      const [sols, users] = await Promise.all([getSolicitudes(), getUsuarios()]);
      setSolicitudes(sols);
      setUsuarios(users);
    } catch (err) {
      console.error('Error cargando solicitudes', err);
      await MySwal.fire('Error', 'Error cargando datos', 'error');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [permisos]);

  const eliminar = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para eliminar solicitudes.', 'warning');
      return;
    }
    const result = await MySwal.fire({
      title: '¿Eliminar solicitud?',
      text: 'No se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteSolicitud(id);
      await MySwal.fire('Eliminada', `Solicitud eliminada: ID ${id}`, 'success');
      await cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error eliminando solicitud', 'error');
    }
  };

  const guardar = async () => {
    if (!fechaSolicitud) {
      await MySwal.fire('Error', 'La fecha es obligatoria', 'error');
      return;
    }
    if (!estado) {
      await MySwal.fire('Error', 'El estado es obligatorio', 'error');
      return;
    }
    if (!idSolicitante) {
      await MySwal.fire('Error', 'Debe seleccionar un solicitante', 'error');
      return;
    }

    if (editId && !permisos.puedeEditar) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para editar solicitudes.', 'warning');
      return;
    }
    if (!editId && !permisos.puedeCrear) {
      await MySwal.fire('Acceso Denegado', 'No tienes permisos para crear solicitudes.', 'warning');
      return;
    }

    const usuarioSeleccionado = usuarios.find(u => u.id === Number(idSolicitante));
    if (!usuarioSeleccionado) {
      await MySwal.fire('Error', 'El solicitante seleccionado no es válido', 'error');
      return;
    }

    const payload = {
      fechaSolicitud,
      estadoSolicitud: estado,
      idUsuarioSolicitante: {
        id: usuarioSeleccionado.id,
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
      },
    };

    try {
      if (editId) {
        await updateSolicitud(editId, payload);
        await MySwal.fire('Actualizado', 'Solicitud actualizada', 'success');
      } else {
        await createSolicitud(payload);
        await MySwal.fire('Creado', 'Solicitud creada', 'success');
      }
      limpiarForm();
      onClose();
      await cargarDatos();
    } catch (error) {
      console.error(error);
      await MySwal.fire('Error', 'Error guardando solicitud', 'error');
    }
  };

  const abrirModalEditar = (sol: any) => {
    if (!permisos.puedeEditar) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para editar solicitudes.', 'warning');
      return;
    }
    setEditId(sol.id);
    setFechaSolicitud(sol.fechaSolicitud);
    setEstado(sol.estadoSolicitud);
    setIdSolicitante(sol.idUsuarioSolicitante?.id || '');
    onOpen();
  };

  const abrirModalNuevo = () => {
    if (!permisos.puedeCrear) {
      MySwal.fire('Acceso Denegado', 'No tienes permisos para crear solicitudes.', 'warning');
      return;
    }
    limpiarForm();
    onOpen();
  };

  const limpiarForm = () => {
    setEditId(null);
    setFechaSolicitud('');
    setEstado('PENDIENTE');
    setIdSolicitante('');
  };

  const filtered = useMemo(() => {
    if (!filterValue) return solicitudes;
    return solicitudes.filter(s =>
      `${s.id} ${s.fechaSolicitud} ${s.estadoSolicitud} ${s.idUsuarioSolicitante?.nombre || ''} ${s.idUsuarioSolicitante?.apellido || ''}`
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [solicitudes, filterValue]);

  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const sliced = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const sorted = useMemo(() => {
    const items = [...sliced];
    const { column, direction } = sortDescriptor;
    items.sort((a, b) => {
      const colKey = column === 'fecha' ? 'fechaSolicitud' : column;
      const x = a[colKey];
      const y = b[colKey];
      return x === y ? 0 : (x > y ? 1 : -1) * (direction === 'ascending' ? 1 : -1);
    });
    return items;
  }, [sliced, sortDescriptor]);

  const renderCell = (item: any, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'fecha':
        return <span className="text-sm text-gray-600">{item.fechaSolicitud}</span>;
      case 'estado':
        return (
          <span
            className={`text-sm font-medium ${
              item.estadoSolicitud === 'RECHAZADA'
                ? 'text-red-600'
                : item.estadoSolicitud === 'APROBADA'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {item.estadoSolicitud}
          </span>
        );
      case 'solicitante':
        return (
          <span className="text-sm text-gray-800">
            {item.idUsuarioSolicitante
              ? `${item.idUsuarioSolicitante.nombre} ${item.idUsuarioSolicitante.apellido || ''}`
              : '—'}
          </span>
        );
      case 'detalles':
        return <span className="text-sm text-gray-600">{item.detalleSolicituds?.length || 0}</span>;
      case 'entregas':
        return <span className="text-sm text-gray-600">{item.entregaMaterials?.length || 0}</span>;
      case 'actions': {
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
            <DropdownItem
              key={`eliminar-${item.id}`}
              onPress={() => eliminar(item.id)}
              className="text-danger"
            >
              Eliminar
            </DropdownItem>
          );
        }
        if (dropdownItems.length === 0) {
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
        return item[columnKey as keyof typeof item] || '—';
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const copy = new Set(prev);
      if (copy.has(key)) {
        if (key === 'actions') return prev;
        copy.delete(key);
      } else {
        copy.add(key);
      }
      return copy;
    });
  };

  const renderMobileDropdown = (s: any) => {
    const dropdownItems = [];
    if (permisos.puedeEditar) {
      dropdownItems.push(
        <DropdownItem key={`editar-${s.id}`} onPress={() => abrirModalEditar(s)}>
          Editar
        </DropdownItem>
      );
    }
    if (permisos.puedeEliminar) {
      dropdownItems.push(
        <DropdownItem key={`eliminar-${s.id}`} onPress={() => eliminar(s.id)}>
          Eliminar
        </DropdownItem>
      );
    }
    if (dropdownItems.length === 0) {
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
        <DropdownMenu>
          {dropdownItems}
        </DropdownMenu>
      </Dropdown>
    );
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

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <Input
          isClearable
          className="w-full md:max-w-[44%]"
          radius="lg"
          placeholder="Buscar por nombre, estado o fecha"
          startContent={<SearchIcon className="text-[#0D1324]" />}
          value={filterValue}
          onValueChange={setFilterValue}
          onClear={() => setFilterValue('')}
        />
        <div className="flex gap-3 items-center">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">Columnas</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Seleccionar columnas">
              {columns
                .filter(c => c.uid !== 'actions')
                .map(col => (
                  <DropdownItem key={col.uid} className="py-1 px-2 flex items-center gap-2">
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

          {permisos.puedeCrear ? (
            <Button
              className="bg-[#0D1324] hover:bg-[#1a2133] text-white font-medium rounded-lg shadow"
              endContent={<PlusIcon />}
              onPress={abrirModalNuevo}
            >
              Nueva Solicitud
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-400 text-sm">Total {solicitudes.length} solicitudes</span>
        <label className="flex items-center text-default-400 text-sm">
          Filas por página:&nbsp;
          <select
            className="bg-transparent outline-none text-default-600 ml-1"
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            {[5, 10, 15].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center gap-2">
      <Button size="sm" variant="flat" isDisabled={page === 1} onPress={() => setPage(page - 1)}>
        Anterior
      </Button>
      <Pagination isCompact showControls page={page} total={pages} onChange={setPage} />
      <Button size="sm" variant="flat" isDisabled={page === pages} onPress={() => setPage(page + 1)}>
        Siguiente
      </Button>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0D1324] flex items-center gap-2">📝 Gestión de Solicitudes</h1>
          <p className="text-sm text-gray-600">Consulta y administra las solicitudes de materiales.</p>
        </header>

        <div className="hidden md:block rounded-xl shadow-sm bg-white overflow-x-auto">
          <Table
            aria-label="Tabla de solicitudes"
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
            <TableHeader columns={columns.filter(c => visibleColumns.has(c.uid))}>
              {col => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === 'actions' ? 'center' : 'start'}
                  width={col.uid === 'solicitante' ? 260 : undefined}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sorted} emptyContent="No se encontraron solicitudes">
              {item => (
                <TableRow key={item.id}>
                  {col => <TableCell>{renderCell(item, col as ColumnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron solicitudes</p>
          ) : (
            sorted.map(s => (
              <Card key={s.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">ID {s.id}</h3>
                    {renderMobileDropdown(s)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fecha:</span> {s.fechaSolicitud}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estado:</span>{' '}
                    <span
                      className={
                        s.estadoSolicitud === 'RECHAZADA'
                          ? 'text-red-600'
                          : s.estadoSolicitud === 'APROBADA'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }
                    >
                      {s.estadoSolicitud}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Solicitante:</span>{' '}
                    {s.idUsuarioSolicitante ? `${s.idUsuarioSolicitante.nombre} ${s.idUsuarioSolicitante.apellido || ''}` : '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Detalles:</span> {s.detalleSolicituds?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Entregas:</span> {s.entregaMaterials?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">ID: {s.id}</p>
                </CardContent>
              </Card>
            ))
          )}
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
                <ModalHeader>{editId ? 'Editar Solicitud' : 'Nueva Solicitud'}</ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    type="date"
                    label="Fecha"
                    value={fechaSolicitud}
                    onValueChange={setFechaSolicitud}
                    radius="sm"
                    autoFocus
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Estado</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={estado}
                      onChange={e => setEstado(e.target.value as 'PENDIENTE' | 'APROBADA' | 'RECHAZADA')}
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="APROBADA">APROBADA</option>
                      <option value="RECHAZADA">RECHAZADA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Solicitante</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={idSolicitante}
                      onChange={e => setIdSolicitante(Number(e.target.value) || '')}
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button
                    variant="light"
                    onPress={() => {
                      limpiarForm();
                      onClose();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="flat"
                    onPress={guardar}
                    disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                  >
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

export default SolicitudesPage;