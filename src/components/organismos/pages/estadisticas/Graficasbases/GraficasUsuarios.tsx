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


export const BarChart = ({ data }: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1', 
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
