interface AddProductButtonProps {
    onClick: () => void;
  }
  
  export default function AddProductButton({ onClick }: AddProductButtonProps) {
    return (
      <div className="mb-4">
        <button
          onClick={onClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          ➕ Agregar Producto
        </button>
      </div>
    );
  }
  