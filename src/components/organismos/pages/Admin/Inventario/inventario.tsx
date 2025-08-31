"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import Swal from "sweetalert2";

import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from "@/Api/inventario";

import { getProductos } from "@/Api/Productosform";
import { getSitios } from "@/Api/SitioService";

import {
  Inventario,
  InventarioFormValues,
  InventarioCreatePayload,
  InventarioUpdatePayload,
} from "@/types/types/inventario";
import { Producto } from "@/types/types/typesProductos";
import { Sitio } from "@/types/types/Sitio";

import DefaultLayout from "@/layouts/default";

import { Accordion, AccordionItem, Button as HeroButton } from "@heroui/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

import axiosInstance from "@/Api/axios";
import { getDecodedTokenFromCookies } from "@/lib/utils";

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState<InventarioFormValues>({
    idProductoId: 0,
    fkSitioId: 0,
    stock: 1,
    placaSena: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  // Cargar permisos sólo al montar el componente
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;

        if (!rolId) {
          console.warn("No se encontró rol del usuario");
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
          setLoading(false);
          return;
        }

        const url = `/permisos/por-ruta?ruta=/inventario&idRol=${rolId}`;
        const response = await axiosInstance.get(url, {
          withCredentials: true,
          timeout: 10000,
        });

        const permisosData = response.data?.data;

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
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, []);

  // Cargar datos sólo cuando se tiene permiso para ver
  useEffect(() => {
    if (permisos.puedeVer) {
      loadData();
    }
  }, [permisos.puedeVer]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inv, prod, sit] = await Promise.all([
        getInventarios(),
        getProductos(),
        getSitios(),
      ]);
      setInventarios(Array.isArray(inv) ? inv : []);
      setProductos(Array.isArray(prod) ? prod : []);
      setSitios(Array.isArray(sit) ? sit : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos. Verifique su conexión.",
      });
      setInventarios([]);
      setProductos([]);
      setSitios([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      idProductoId: 0,
      fkSitioId: 0,
      stock: 1,
      placaSena: "",
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!permisos.puedeCrear && !editId) {
      await Swal.fire("Acceso Denegado", "No tienes permiso para crear inventarios.", "warning");
      return;
    }
    if (!permisos.puedeEditar && editId) {
      await Swal.fire("Acceso Denegado", "No tienes permiso para editar inventarios.", "warning");
      return;
    }
    if (!form.stock || !form.idProductoId || !form.fkSitioId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Los campos Stock, Producto y Sitio son requeridos",
      });
      return;
    }
    if (form.stock !== 1) {
      Swal.fire({
        icon: "info",
        title: "Stock ajustado",
        text: "El stock debe ser 1 para cada unidad individual.",
      });
      setForm({ ...form, stock: 1 });
      return;
    }

    try {
      const placaSenaValue = form.placaSena && form.placaSena.trim().length > 0 ? form.placaSena.trim() : undefined;

      if (editId) {
        const payload: InventarioUpdatePayload = {
          stock: form.stock,
          fkSitioId: form.fkSitioId,
          idProductoId: form.idProductoId,
          placaSena: placaSenaValue,
        };
        await updateInventario(editId, payload);
        Swal.fire("Actualizado", "Inventario actualizado con éxito", "success");
      } else {
        const payload: InventarioCreatePayload = {
          stock: form.stock,
          fkSitioId: form.fkSitioId,
          idProductoId: form.idProductoId,
          placaSena: placaSenaValue,
        };
        await createInventario(payload);
        Swal.fire("Creado", "Inventario creado correctamente", "success");
      }
      resetForm();
      setIsDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", "No se pudo guardar el inventario. Intente nuevamente.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await Swal.fire("Acceso Denegado", "No tienes permiso para eliminar inventarios.", "warning");
      return;
    }
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el inventario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      try {
        await deleteInventario(id);
        Swal.fire("Eliminado", "Inventario eliminado correctamente", "success");
        await loadData();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error", "No se pudo eliminar el inventario", "error");
      }
    }
  };

  const handleEdit = (inv: Inventario) => {
    if (!permisos.puedeEditar) {
      Swal.fire("Acceso Denegado", "No tienes permiso para editar inventarios.", "warning");
      return;
    }
    setForm({
      stock: inv.stock || 1,
      idProductoId: inv.idProducto?.id || 0,
      fkSitioId: inv.fkSitio?.id || 0,
      placaSena: inv.placaSena || "",
    });
    setEditId(inv.idProductoInventario);
    setIsDialogOpen(true);
  };

  const handleNewInventario = () => {
    if (!permisos.puedeCrear) {
      Swal.fire("Acceso Denegado", "No tienes permiso para crear inventarios.", "warning");
      return;
    }
    resetForm();
    setIsDialogOpen(true);
  };

  // Agrupar inventarios por sitio
  const agrupado = inventarios.reduce<Record<string, Inventario[]>>((acc, inv) => {
    const sitio = inv.fkSitio?.nombre || "Sin sitio";
    if (!acc[sitio]) acc[sitio] = [];
    acc[sitio].push(inv);
    return acc;
  }, {});

  // Filtrar por sitio, producto o placa SENA
  const filteredAgrupado = Object.entries(agrupado).filter(([sitio, items]) => {
    if (!filtro.trim()) return true;

    const filtroLower = filtro.toLowerCase().trim();
    const sitioMatch = sitio.toLowerCase().includes(filtroLower);
    const productoMatch = items.some((inv) =>
      inv.idProducto?.nombre?.toLowerCase().includes(filtroLower)
    );
    const placaMatch = items.some((inv) =>
      inv.placaSena?.toLowerCase().includes(filtroLower)
    );

    return sitioMatch || productoMatch || placaMatch;
  });

  if (loading) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando inventarios...</p>
            <p className="text-gray-500 text-sm mt-2">Por favor espere</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <CubeIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Acceso Restringido</h2>
            <p className="text-red-600">
              No tienes permiso para ver la sección de inventarios.
            </p>
            <p className="text-red-500 text-sm mt-2">
              Contacta al administrador si necesitas acceso.
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventarios</h1>
              <p className="text-gray-600 text-sm">
                Visualiza y gestiona el inventario disponible por sitio y producto.
              </p>
            </div>
          </div>

          {permisos.puedeCrear && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <HeroButton
                  color="primary"
                  className="flex items-center gap-2"
                  onClick={handleNewInventario}
                >
                  <PlusIcon className="w-4 h-4" />
                  Nuevo Inventario
                </HeroButton>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-sm bg-white/95 max-w-md rounded-lg p-6 border border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 text-xl mb-4">
                    {editId ? "Editar Inventario" : "Crear Inventario"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: Number(e.target.value) || 1 })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      min={1}
                      max={1}
                      aria-describedby="stock-help"
                    />
                    <small id="stock-help" className="text-xs text-gray-500 mt-1 block">
                      El stock debe ser 1 para controlar unidades indivisibles.
                    </small>
                  </div>

                  {/* Producto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.idProductoId}
                      onChange={(e) =>
                        setForm({ ...form, idProductoId: Number(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      aria-describedby="producto-help"
                    >
                      <option value={0}>Selecciona un producto</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    <small id="producto-help" className="text-xs text-gray-500 mt-1 block">
                      Seleccione el producto para el inventario.
                    </small>
                  </div>

                  {/* Sitio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sitio <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.fkSitioId}
                      onChange={(e) =>
                        setForm({ ...form, fkSitioId: Number(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      aria-describedby="sitio-help"
                    >
                      <option value={0}>Selecciona un sitio</option>
                      {sitios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                    <small id="sitio-help" className="text-xs text-gray-500 mt-1 block">
                      Seleccione la ubicación del inventario.
                    </small>
                  </div>

                  {/* Placa SENA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa SENA
                    </label>
                    <input
                      type="text"
                      placeholder="Ingrese la placa SENA (opcional)"
                      value={form.placaSena || ""}
                      onChange={(e) => setForm({ ...form, placaSena: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                      maxLength={50}
                      aria-describedby="placa-help"
                    />
                    <small id="placa-help" className="text-xs text-gray-500 mt-1 block">
                      Código de identificación SENA (opcional, máximo 50 caracteres).
                    </small>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <DialogClose asChild>
                      <HeroButton
                        variant="ghost"
                        onClick={() => {
                          resetForm();
                          setIsDialogOpen(false);
                        }}
                      >
                        Cancelar
                      </HeroButton>
                    </DialogClose>
                    <HeroButton
                      color="primary"
                      onClick={handleSubmit}
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      {editId ? "Guardar Cambios" : "Crear Inventario"}
                    </HeroButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CubeIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Inventarios</p>
                <p className="text-2xl font-bold text-gray-900">{inventarios.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sitios con Stock</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(agrupado).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Placa SENA</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventarios.filter((inv) => inv.placaSena && inv.placaSena.trim()).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por producto, sitio o placa SENA..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Campo de búsqueda para filtrar inventarios"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {filtro && (
            <p className="text-sm text-gray-600 mt-2">
              Mostrando{" "}
              {filteredAgrupado.reduce((acc, [, items]) => acc + items.length, 0)} resultados para " {filtro}"
            </p>
          )}
        </div>

        {/* Contenido principal */}
        {inventarios.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <CubeIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inventarios</h3>
            <p className="text-gray-600 mb-4">No se encontraron registros de inventario en el sistema.</p>
            {permisos.puedeCrear && (
              <HeroButton color="primary" onClick={handleNewInventario}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Crear primer inventario
              </HeroButton>
            )}
          </div>
        ) : (
          <Accordion variant="splitted" className="gap-4">
            {filteredAgrupado.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
                <p className="text-gray-600">No se encontraron resultados para "{filtro}"</p>
                <HeroButton variant="ghost" onClick={() => setFiltro("")} className="mt-3">
                  Limpiar búsqueda
                </HeroButton>
              </div>
            ) : (
              filteredAgrupado.map(([sitio, items]) => (
                <AccordionItem
                  key={sitio}
                  aria-label={`Inventario del sitio ${sitio}`}
                  title={
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">{sitio}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {items.length} {items.length === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                  }
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[700px]">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-3 font-medium text-gray-700">ID</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-700">Producto</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-700">Sitio</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-700">Stock</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-700">Placa SENA</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-700">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((inv, index) => (
                              <tr
                                key={inv.idProductoInventario}
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                              >
                                <td className="px-4 py-3 text-gray-900 font-mono text-xs">
                                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    #{inv.idProductoInventario}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 bg-blue-50 rounded">
                                      <CubeIcon className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {inv.idProducto?.nombre || "Sin producto"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {inv.fkSitio?.nombre || "Sin sitio"}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {inv.stock} unidad{inv.stock !== 1 ? "es" : ""}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {inv.placaSena ? (
                                    <span className="bg-purple-100 text-purple-800 text-xs font-mono px-2 py-1 rounded">
                                      {inv.placaSena}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic text-xs">Sin placa</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    {permisos.puedeEditar && (
                                      <HeroButton
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(inv)}
                                        className="p-1.5 hover:bg-blue-50 rounded-md"
                                        aria-label={`Editar inventario ${inv.idProductoInventario}`}
                                      >
                                        <PencilSquareIcon className="w-4 h-4 text-blue-600" />
                                      </HeroButton>
                                    )}
                                    {permisos.puedeEliminar && (
                                      <HeroButton
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(inv.idProductoInventario)}
                                        className="p-1.5 hover:bg-red-50 rounded-md"
                                        aria-label={`Eliminar inventario ${inv.idProductoInventario}`}
                                      >
                                        <TrashIcon className="w-4 h-4 text-red-600" />
                                      </HeroButton>
                                    )}
                                    {!permisos.puedeEditar && !permisos.puedeEliminar && (
                                      <span className="text-xs text-gray-400 italic">Sin permisos</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Resumen del sitio */}
                      <div className="bg-gray-50 px-4 py-3 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Total productos en {sitio}:</span>
                            <span className="font-semibold text-gray-900">{items.length} registros</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Con Placa SENA:</span>
                            <span className="font-semibold text-purple-700">
                              {items.filter((inv) => inv.placaSena && inv.placaSena.trim()).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionItem>
              ))
            )}
          </Accordion>
        )}
        {/* Footer con información adicional */}
        {inventarios.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información del Inventario:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Cada registro representa una unidad individual del producto</li>
                  <li>• El stock siempre es 1 para mantener trazabilidad unitaria</li>
                  <li>• La placa SENA es opcional y sirve para identificación institucional</li>
                  <li>• Los movimientos se registran automáticamente en cada cambio</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
