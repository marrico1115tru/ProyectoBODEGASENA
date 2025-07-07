'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];  // <-- Aquí permitimos string o string[]
    }[];
    title: string;
  };
}

export const BarChart = ({ data }: BarChartProps) => {
  return (
    <div className="w-full h-full">
      <Bar
        data={{
          labels: data.labels,
          datasets: data.datasets,
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: data.title },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Productos',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad',
              },
            },
          },
        }}
      />
    </div>
  );
};
