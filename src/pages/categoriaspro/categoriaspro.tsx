import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    title: 'Cleaning Supplies',
    description: 'Brooms, mops, soaps',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Educational Resources',
    description: 'Products from the TIC area',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Machine Tools',
    description: 'Products from the Agricultural area',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Agricultural inputs',
    description: 'Products from the Environmental area',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'New Category',
    description: 'Description here',
    image: 'https://via.placeholder.com/150',
  },
];

export default function CategoriesView() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">WAREHOUSE</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar material"
            className="border rounded pl-10 pr-4 py-2 w-64"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white rounded shadow p-4">
            <img src={cat.image} alt={cat.title} className="w-full h-32 object-cover rounded mb-2" />
            <h2 className="text-lg font-semibold text-gray-800">{cat.title}</h2>
            <p className="text-sm text-gray-600">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
