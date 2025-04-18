// src/molecules/AddProductButton.tsx
import { PlusIcon } from "@heroicons/react/24/solid";

interface AddProductButtonProps {
  onClick: () => void;
}

export default function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
    >
      <PlusIcon className="w-5 h-5" />
      Agregar producto
    </button>
  );
}
