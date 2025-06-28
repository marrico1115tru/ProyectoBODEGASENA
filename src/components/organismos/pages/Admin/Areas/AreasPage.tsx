import { useEffect, useState } from "react";
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from "@/Api/AreasService";
import { Area, AreaFormValues, Sede } from "@/types/types";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
} from "@/components/icons/Icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { areaSchema } from "@/schemas/areaSchema";

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editArea, setEditArea] = useState<Area | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
  });

  const fetchAreas = async () => {
    const res = await getAreas();
    setAreas(res);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const onSubmit = async (data: AreaFormValues) => {
    if (editArea) {
      await updateArea(editArea.id, data);
    } else {
      await createArea(data);
    }
    fetchAreas();
    reset();
    setModalOpen(false);
    setEditArea(null);
  };

  const handleEdit = (area: Area) => {
    setEditArea(area);
    reset({
      nombreArea: area.nombreArea,
      idSede: area.idSede,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteArea(id);
    fetchAreas();
  };

  const filteredAreas = areas.filter((area) =>
    area.nombreArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Gestión de Áreas</h1>
        <Button onClick={() => setModalOpen(true)} startContent={<PlusIcon />}>Agregar área</Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar área..."
          startContent={<SearchIcon />}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border">ID</th>
            <th className="p-2 text-left border">Nombre</th>
            <th className="p-2 text-left border">Sede</th>
            <th className="p-2 text-left border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.map((area) => (
            <tr key={area.id} className="border-b hover:bg-gray-50">
              <td className="p-2 border">{area.id}</td>
              <td className="p-2 border">{area.nombreArea}</td>
              <td className="p-2 border">{area.idSede?.nombreSede}</td>
              <td className="p-2 border flex gap-2">
                <Button size="sm" variant="light" onClick={() => handleEdit(area)} startContent={<EditIcon />}>
                  Editar
                </Button>
                <Button size="sm" variant="light" color="danger" onClick={() => handleDelete(area.id)} startContent={<DeleteIcon />}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} placement="center">
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{editArea ? "Editar Área" : "Agregar Área"}</ModalHeader>
            <ModalBody>
              <Input
                {...register("nombreArea")}
                label="Nombre del Área"
                placeholder="Ingrese el nombre"
                isInvalid={!!errors.nombreArea}
                errorMessage={errors.nombreArea?.message}
              />
              <Select
                label="Sede"
                {...register("idSede.id")}
                isInvalid={!!errors.idSede?.id}
                errorMessage={errors.idSede?.id?.message}
              >
                <SelectItem key="1" value="1">
                  Sede Principal
                </SelectItem>
                <SelectItem key="2" value="2">
                  Sede Alterna
                </SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={() => { setModalOpen(false); setEditArea(null); reset(); }}>Cancelar</Button>
              <Button color="primary" type="submit">
                {editArea ? "Actualizar" : "Crear"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
