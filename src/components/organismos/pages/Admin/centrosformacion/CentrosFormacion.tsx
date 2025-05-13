import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DefaultLayout from '@/layouts/default';
import { fetchCentros, createCentro, updateCentro, deleteCentro, CentroFormacion } from '@/Api/centrosformacionTable';

const CentrosFormaciones = () => {
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroFormacion | null>(null);
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', telefono: '' });

  useEffect(() => {
    cargarCentros();
  }, []);

  const cargarCentros = async () => {
    try {
      const data = await fetchCentros();
      setCentros(data);
    } catch (error) {
      console.error("Error cargando centros:", error);
    }
  };

  const openCreateModal = () => {
    setEditingCentro(null);
    setFormData({ nombre: '', ubicacion: '', telefono: '' });
    setOpenModal(true);
  };

  const openEditModal = (centro: CentroFormacion) => {
    setEditingCentro(centro);
    setFormData({
      nombre: centro.nombre,
      ubicacion: centro.ubicacion,
      telefono: centro.telefono ?? ''
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    });

    if (result.isConfirmed) {
      try {
        await deleteCentro(id);
        await cargarCentros();
        Swal.fire('¡Eliminado!', 'El centro ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error eliminando centro:", error);
        Swal.fire('Error', 'Hubo un error al eliminar el centro.', 'error');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCentro) {
        await updateCentro(editingCentro.id, formData);
        Swal.fire('Actualizado', 'Centro actualizado correctamente.', 'success');
      } else {
        await createCentro(formData);
        Swal.fire('Creado', 'Centro creado correctamente.', 'success');
      }
      await cargarCentros();
      setOpenModal(false);
    } catch (error) {
      console.error("Error guardando centro:", error);
      Swal.fire('Error', 'Hubo un error al guardar el centro.', 'error');
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8">
        <Card className="max-w-7xl mx-auto shadow-xl rounded-2xl p-6 border border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Centros de Formación</h1>
            <Button onClick={openCreateModal} className="bg-black hover:bg-gray-800 text-white" size="lg">
              Nuevo Centro
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center table-auto border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-900 text-white text-base">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Ubicación</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Fecha Registro</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-800">
                {centros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 text-lg">
                      No hay centros registrados.
                    </td>
                  </tr>
                ) : (
                  centros.map((centro) => (
                    <tr key={centro.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">{centro.nombre}</td>
                      <td className="px-4 py-4">{centro.ubicacion}</td>
                      <td className="px-4 py-4">{centro.telefono || 'N/A'}</td>
                      <td className="px-4 py-4">{new Date(centro.fecha_registro).toLocaleDateString()}</td>
                      <td className="px-4 py-4 flex justify-center gap-3">
                        <Button
                          onClick={() => openEditModal(centro)}
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-4 py-1"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(centro.id)}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-1"
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-md rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingCentro ? "Editar Centro" : "Nuevo Centro"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <Input
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
              <Input
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
              <Input
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button onClick={() => setOpenModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingCentro ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DefaultLayout>
  );
};

export default CentrosFormaciones;
