import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const BarChart: React.FC<{ data: any }> = ({ data }) => (
  <div className="w-full h-[300px]">
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
      }}
    />
  </div>
);

export const PieChart: React.FC<{ data: any }> = ({ data }) => (
  <div className="w-full h-[300px]">
    <Pie
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      }}
    />
  </div>
);
