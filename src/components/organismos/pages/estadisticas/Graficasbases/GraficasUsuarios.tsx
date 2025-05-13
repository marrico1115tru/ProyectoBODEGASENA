// src/components/estadisticas/Graficasbases/GraficasBaseSitios.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Props {
  data: any;
}

// Gráfica de barras
export const BarChart = ({ data }: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1', // Texto claro
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// Gráfica de pastel
export const PieChart = ({ data }: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
        },
        position: 'bottom' as const,
      },
    },
  };

  return <Pie data={data} options={options} />;
};
