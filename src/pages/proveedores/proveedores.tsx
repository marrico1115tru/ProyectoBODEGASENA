import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

const suppliers = [
  { id: 1, name: "Supplier A", contact: "123-456-7890", email: "a@example.com", terms: "Net 30" },
  { id: 2, name: "Supplier B", contact: "234-567-8901", email: "b@example.com", terms: "Net 15" },
  { id: 3, name: "Supplier C", contact: "345-678-9012", email: "c@example.com", terms: "COD" },
  { id: 4, name: "Supplier D", contact: "456-789-0123", email: "d@example.com", terms: "Net 60" },
  { id: 5, name: "Supplier E", contact: "567-890-1234", email: "e@example.com", terms: "Prepaid" }
];

export default function SupplierTable() {
  const [search, setSearch] = useState("");

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Supplier Directory</h1>
        <p className="text-gray-600 mb-6">
          Explore and manage your suppliers here. You can filter by name using the search bar below.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar proveedor..."
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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Contract Terms</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{supplier.id}</td>
                  <td className="px-4 py-2 font-medium">{supplier.name}</td>
                  <td className="px-4 py-2">{supplier.contact}</td>
                  <td className="px-4 py-2">{supplier.email}</td>
                  <td className="px-4 py-2">{supplier.terms}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSuppliers.length === 0 && (
            <p className="text-center text-gray-500 mt-6">No suppliers found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
