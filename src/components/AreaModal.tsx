import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Area, AreaPayload } from '@/types/types/typesArea';
import { useSedes } from '@/hooks/Sedes/useSedes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Area;
  onSubmit: (p: AreaPayload) => void;
}

export default function AreaModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const { sedes } = useSedes();
  const [nombreArea, setNombre] = useState('');
  const [sedeId, setSedeId]     = useState<number | ''>('');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombreArea ?? '');
      setSedeId(initialData.idSede.id);
    } else {
      setNombre('');
      setSedeId('');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!nombreArea || sedeId === '') return;
    onSubmit({ nombreArea, idSede: { id: Number(sedeId) } });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Transition.Child as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-90">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold">
                  {initialData ? 'Editar Área' : 'Nueva Área'}
                </Dialog.Title>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Área</label>
                  <input
                    value={nombreArea}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej. Área Contable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sede</label>
                  <select
                    value={sedeId}
                    onChange={(e) => setSedeId(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>-- Selecciona una sede --</option>
                    {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                  Cancelar
                </button>
                <button onClick={handleSubmit} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  {initialData ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
