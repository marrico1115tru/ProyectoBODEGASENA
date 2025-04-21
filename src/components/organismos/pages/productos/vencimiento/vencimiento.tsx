import { useState } from "react";
import { Search } from "lucide-react";
import DefaultLayout from "@/layouts/default"; // Asegúrate que esta ruta sea correcta

const products = [
  {
    id: 1,
    name: "Abono",
    category: "Insumo Agrícola",
    expiration: "2024-10-30",
    status: "Vigente",
    expireDay: "",
    alert: "",
  },
  {
    id: 2,
    name: "Harina",
    category: "Consumible",
    expiration: "2024-09-30",
    status: "",
    expireDay: "20",
    alert: "Próximo a vencer",
  },
  {
    id: 3,
    name: "Fertilizante",
    category: "Insumo Agrícola",
    expiration: "2024-09-10",
    status: "Vencido",
    expireDay: "",
    alert: "",
  },
];

export default function ExpirationDates() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div className="p-10 bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Expiration Dates</h1>
          <p className="text-gray-600 mb-6">
            Review products with their expiration dates and current state. Use the search bar to filter them by name.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Buscar material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="text-gray-500 w-5 h-5" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Expiration Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Expire Day</th>
                  <th className="px-4 py-2">Alert</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{item.expiration}</td>
                    <td className="px-4 py-2">
                      {item.status === "Vencido" ? (
                        <span className="bg-red-500 text-white px-2 py-1 rounded">
                          {item.status}
                        </span>
                      ) : (
                        item.status
                      )}
                    </td>
                    <td className="px-4 py-2">{item.expireDay}</td>
                    <td className="px-4 py-2">{item.alert}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-4">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
