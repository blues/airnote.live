// Central Chart.js setup. Replaces `chart.js/auto` (which registers every
// controller/element/scale) with only the pieces the Airnote charts use, so the
// unused chart types (pie, doughnut, radar, scatter, ...) are tree-shaken out of
// the dashboard bundle. Import Chart (and its types) from here in every chart.
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Filler,
  Legend,
  Title,
  Tooltip
);

export default Chart;
export type { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
