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

import { Inventario, InventarioFormValues } from "@/types/types/inventario";
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

import axios from "axios";
import { getDecodedTokenFromCookies } from "@/lib/utils";

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState<InventarioFormValues>({
    idProductoId: 0,
    fkSitioId: 0,
    stock: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

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
        if (!rolId) {
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
          return;
        }

        // Ajustar la ruta según el sistema de permisos (ejemplo /inventario)
        const url = `http://localhost:3000/permisos/por-ruta?ruta=/InventarioPage&idRol=${rolId}`;
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

  // Cargar datos sólo si puede ver
  const loadData = async () => {
    if (!permisos.puedeVer) return;
    try {
      const [inv, prod, sit] = await Promise.all([
        getInventarios(),
        getProductos(),
        getSitios(),
      ]);
      setInventarios(inv);
      setProductos(prod);
      setSitios(sit);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [permisos]);

  // Manejar submit con validaciones de permisos
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
        text: "Todos los campos son requeridos",
      });
      return;
    }

    try {
      if (editId) {
        await updateInventario(editId, form);
        Swal.fire("Actualizado", "Inventario actualizado con éxito", "success");
      } else {
        await createInventario(form);
        Swal.fire("Creado", "Inventario creado correctamente", "success");
      }

      setForm({ idProductoId: 0, fkSitioId: 0, stock: 0 });
      setEditId(null);
      await loadData();
    } catch {
      Swal.fire("Error", "No se pudo guardar el inventario", "error");
    }
  };

  // Manejar eliminación con validación de permisos
  const handleDelete = async (id: number) => {
    if (!permisos.puedeEliminar) {
      await Swal.fire("Acceso Denegado", "No tienes permiso para eliminar inventarios.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el inventario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteInventario(id);
        Swal.fire("Eliminado", "Inventario eliminado correctamente", "success");
        await loadData();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el inventario", "error");
      }
    }
  };

  // Manejar edición con validación de permisos
  const handleEdit = (inv: Inventario) => {
    if (!permisos.puedeEditar) {
      Swal.fire("Acceso Denegado", "No tienes permiso para editar inventarios.", "warning");
      return;
    }
    setForm({
      stock: inv.stock,
      idProductoId: inv.idProducto?.id || 0,
      fkSitioId: inv.fkSitio?.id || 0,
    });
    setEditId(inv.idProductoInventario);
    document.getElementById("openDialog")?.click();
  };

  // Agrupación por sitio
  const agrupado = inventarios.reduce<Record<string, Inventario[]>>((acc, inv) => {
    const sitio = inv.fkSitio?.nombre || "Sin sitio";
    if (!acc[sitio]) acc[sitio] = [];
    acc[sitio].push(inv);
    return acc;
  }, {});

  // Bloquear vista completa si no puede ver
  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permiso para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <CubeIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Gestión de Inventarios</h1>
              <p className="text-muted-foreground text-sm">
                Visualiza el inventario disponible por sitio y producto.
              </p>
            </div>
          </div>

          {/* Solo mostrar botón nuevo si tiene permiso */}
          {permisos.puedeCrear && (
            <Dialog>
              <DialogTrigger asChild>
                <HeroButton color="primary" id="openDialog" className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  {editId ? "Editar Inventario" : "Nuevo Inventario"}
                </HeroButton>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-sm bg-white/90 max-w-md rounded-lg p-6">
                <DialogHeader>
                  <DialogTitle className="text-black text-xl mb-2">
                    {editId ? "Editar Inventario" : "Crear Inventario"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Producto</label>
                    <select
                      value={form.idProductoId}
                      onChange={(e) => setForm({ ...form, idProductoId: Number(e.target.value) })}
                      className="w-full mt-1 border p-2 rounded bg-white"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="0">Selecciona un producto</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Sitio</label>
                    <select
                      value={form.fkSitioId}
                      onChange={(e) => setForm({ ...form, fkSitioId: Number(e.target.value) })}
                      className="w-full mt-1 border p-2 rounded bg-white"
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      <option value="0">Selecciona un sitio</option>
                      {sitios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <DialogClose asChild>
                      <HeroButton variant="ghost">Cancelar</HeroButton>
                    </DialogClose>
                    <HeroButton
                      color="primary"
                      onClick={handleSubmit}
                      disabled={editId ? !permisos.puedeEditar : !permisos.puedeCrear}
                    >
                      {editId ? "Guardar Cambios" : "Crear"}
                    </HeroButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filtro */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar producto o sitio"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Inventario agrupado */}
        <Accordion variant="splitted">
          {Object.entries(agrupado)
            .filter(([sitio]) => sitio.toLowerCase().includes(filtro.toLowerCase()))
            .map(([sitio, items]) => (
              <AccordionItem
                key={sitio}
                aria-label={sitio}
                title={
                  <div className="flex justify-between items-center w-full">
                    <span>{sitio}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {items.length} productos
                    </span>
                  </div>
                }
              >
                <Card className="mb-4">
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="text-left px-4 py-2">ID</th>
                          <th className="text-left px-4 py-2">Producto</th>
                          <th className="text-left px-4 py-2">Sitio</th>
                          <th className="text-left px-4 py-2">Stock</th>
                          <th className="text-left px-4 py-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((inv) => (
                          <tr key={inv.idProductoInventario} className="border-t">
                            <td className="px-4 py-2">{inv.idProductoInventario}</td>
                            <td className="px-4 py-2">{inv.idProducto?.nombre}</td>
                            <td className="px-4 py-2">{inv.fkSitio?.nombre}</td>
                            <td className="px-4 py-2">{inv.stock}</td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <HeroButton
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(inv)}
                                  disabled={!permisos.puedeEditar}
                                >
                                  <PencilSquareIcon className="w-4 h-4 text-blue-600" />
                                </HeroButton>
                                <HeroButton
                                  size="sm"
                                  color="danger"
                                  variant="ghost"
                                  onClick={() => handleDelete(inv.idProductoInventario)}
                                  disabled={!permisos.puedeEliminar}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </HeroButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </DefaultLayout>
  );
}
