import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

type Props = {
  data: any;
  options?: any;
};

export const BarChart: React.FC<Props> = ({ data, options }) => (
  <Bar data={data} options={options} />
);

export const LineChart: React.FC<Props> = ({ data, options }) => (
  <Line data={data} options={options} />
);

export const PieChart: React.FC<Props> = ({ data, options }) => (
  <Pie data={data} options={options} />
);
""
