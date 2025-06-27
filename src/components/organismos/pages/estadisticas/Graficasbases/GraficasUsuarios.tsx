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
      backgroundColor?: string;
    }[];
    title: string;
  };
}

export const BarChart = ({ data }: BarChartProps) => {
  const allValues = data.datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues);
  const isSmallScale = maxValue <= 5;

  const yMax = isSmallScale ? 5 : Math.ceil(maxValue / 10) * 10;
  const stepSize = isSmallScale ? 1 : 10;

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
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categoría',
              },
            },
            y: {
              beginAtZero: true,
              max: yMax,
              ticks: {
                stepSize,
                precision: 0,
              },
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
