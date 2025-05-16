import { useEffect, useState } from 'react';
import { Acceso } from '@/types/types/acceso';
import {
  getAccesos,
  createAcceso,
  updateAcceso,
  deleteAcceso,
} from '@/Api/accesosService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AccesoView() {
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [formData, setFormData] = useState<Omit<Acceso, 'id'>>({
    opcionId: 0,
    rolId: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAccesos();
  }, []);

  const fetchAccesos = async () => {
    const data = await getAccesos();
    setAccesos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedId !== null) {
      await updateAcceso(selectedId, formData);
    } else {
      await createAcceso(formData);
    }
    setFormData({ opcionId: 0, rolId: 0 });
    setEditMode(false);
    fetchAccesos();
  };

  const handleEdit = (acceso: Acceso) => {
    setFormData({ opcionId: acceso.opcionId, rolId: acceso.rolId });
    setSelectedId(acceso.id);
    setEditMode(true);
  };

  const handleDelete = async (id: number) => {
    await deleteAcceso(id);
    fetchAccesos();
  };

  return (
    <div className="p-5">
      <Card className="mb-5">
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Opción ID</label>
              <Input name="opcionId" value={formData.opcionId} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol ID</label>
              <Input name="rolId" value={formData.rolId} onChange={handleChange} required />
            </div>
            <Button type="submit" className="col-span-2 mt-3">
              {editMode ? 'Actualizar Acceso' : 'Crear Acceso'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Opción ID</th>
            <th className="border p-2">Rol ID</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accesos.map((acceso) => (
            <tr key={acceso.id}>
              <td className="border p-2">{acceso.id}</td>
              <td className="border p-2">{acceso.opcionId}</td>
              <td className="border p-2">{acceso.rolId}</td>
              <td className="border p-2">
                <Button onClick={() => handleEdit(acceso)} className="mr-2">
                  Editar
                </Button>
                <Button onClick={() => handleDelete(acceso.id)} variant="destructive">
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
""
