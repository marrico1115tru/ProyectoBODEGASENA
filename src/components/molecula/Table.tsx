// src/components/molecules/Table.tsx
import React from "react";

interface TableProps {
  data: any[];
  columns: any[];
}

export const Table = ({ data, columns }: TableProps) => {
  return (
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col, idx) => (
            <th key={idx} className="px-4 py-2 text-left border-b">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col, colIdx) => (
              <td key={colIdx} className="px-4 py-2 border-b">{row[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
