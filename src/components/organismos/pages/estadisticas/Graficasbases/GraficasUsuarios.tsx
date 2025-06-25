'use client';

import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'bar' | 'line' | 'pie';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
  title: string;
}

interface ChartBaseProps {
  type: ChartType;
  data: ChartData;
}

export const ChartBase = ({ type, data }: ChartBaseProps) => {
  const allValues = data.datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues, 0);

  // Calcular escala dinámica solo para bar/line
  let stepSize = 1;
  let yMax = 10;

  if (maxValue > 1000) {
    stepSize = 200;
    yMax = Math.ceil(maxValue / 200) * 200;
  } else if (maxValue > 500) {
    stepSize = 100;
    yMax = Math.ceil(maxValue / 100) * 100;
  } else if (maxValue > 100) {
    stepSize = 20;
    yMax = Math.ceil(maxValue / 20) * 20;
  } else if (maxValue > 10) {
    stepSize = 5;
    yMax = Math.ceil(maxValue / 5) * 5;
  } else {
    stepSize = 1;
    yMax = 5;
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: data.title,
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y ?? context.parsed}`,
        },
      },
    },
  };

  const barAndLineOptions = {
    ...commonOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categoría',
          font: { size: 14 },
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
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
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      {type === 'bar' && (
        <Bar data={data} options={barAndLineOptions} />
      )}
      {type === 'line' && (
        <Line data={data} options={barAndLineOptions} />
      )}
      {type === 'pie' && (
        <Pie data={data} options={commonOptions} />
      )}
    </div>
  );
};
