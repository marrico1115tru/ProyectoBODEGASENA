import { useEffect, useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Button, Select, SelectItem,
} from "@heroui/react";
import { AreaFormValues } from "@/types/types/typesArea";
import { getSedes } from "@/Api/SedesService";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const areaSchema = z.object({
  nombreArea: z.string().min(3, "Mínimo 3 caracteres"),
  idSede: z.object({ id: z.number().min(1, "Seleccione una sede válida") }),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AreaFormValues) => void;
  initialData?: AreaFormValues;
  mode?: "crear" | "editar";
}

export default function AreaFormModal({ isOpen, onClose, onSubmit, initialData, mode = "crear" }: Props) {
  const [form, setForm] = useState<AreaFormValues>({ nombreArea: "", idSede: { id: 0 } });
  const [errors, setErrors] = useState<{ nombreArea?: string; idSede?: string }>({});
  const [sedes, setSedes] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    getSedes().then(data => {
      setSedes(
        data
          .filter((sede: any) => sede.id && sede.nombre != null)
          .map((sede: any) => ({
            id: sede.id,
            nombre: sede.nombre ?? "",
          }))
      );
    });
  }, []);

  useEffect(() => {
    setForm(initialData || { nombreArea: "", idSede: { id: 0 } });
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const result = areaSchema.safeParse(form);
    if (!result.success) {
      const newErrors: any = {};
      result.error.errors.forEach((e) => {
        const path = e.path.join(".");
        newErrors[path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Corrige los errores");
      return;
    }
    onSubmit(form);
    setForm({ nombreArea: "", idSede: { id: 0 } });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} placement="center">
      <ModalContent>
        <ModalHeader>{mode === "crear" ? "Crear Área" : "Editar Área"}</ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="Nombre del Área"
            placeholder="Ej: Contabilidad"
            value={form.nombreArea}
            onChange={(e) => setForm({ ...form, nombreArea: e.target.value })}
            isInvalid={!!errors.nombreArea}
            errorMessage={errors.nombreArea}
          />
          <Select
            label="Sede"
            selectedKeys={form.idSede.id ? [String(form.idSede.id)] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0];
              const id = parseInt(String(key));
              setForm({ ...form, idSede: { id } });
            }}
            isInvalid={!!errors.idSede}
            errorMessage={errors.idSede}
          >
            {sedes.map((s) => (
              <SelectItem key={s.id}>{s.nombre}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancelar</Button>
          <Button color="primary" onPress={handleSubmit}>
            {mode === "crear" ? "Crear" : "Actualizar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
