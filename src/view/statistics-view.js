import Chart from 'chart.js';
import SmartView from './smart-view';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { sortPointCount, sortPointPrice, sortPointDuration } from '../utils/utils';
import dayjs from 'dayjs';
import { getDurationFormat } from '../utils/duration';

const renderChart = (pointsStatistic, elementCtx, sortFunction, key, expression) => {

  pointsStatistic.sort(sortFunction);
  return new Chart(elementCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: pointsStatistic.map((element) => element.name),
      datasets: [{
        data: pointsStatistic.map((element) => element[key]),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: expression,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<main class="page-body__page-main  page-main">
<div class="page-body__container">
  <section class="trip-events  trip-events--hidden">
    <h2 class="visually-hidden">Trip events</h2>
  </section>

  <section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>
</div>
</main>`
);

export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(points) {
    super();

    this._data = {
      points,
    };

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const {points} = this._data;
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;
    const pointsStatistic = [];
    points.forEach((point) => {
      const type = point.typePoint.toUpperCase();
      const existing = pointsStatistic.find((element) => element.name === type);
      if (existing) {
        existing.price += point.price;
        existing.count += 1;
        existing.duration += dayjs(point.endDate).diff(point.startDate, 'm');

      } else {
        pointsStatistic.push({'name': type, 'price': point.price, 'count': 1, 'duration': dayjs(point.endDate).diff(point.startDate, 'ms')});
      }
    });
    this.#moneyChart = renderChart(pointsStatistic, moneyCtx, sortPointPrice, 'price', (val) => `€ ${val}`);
    this.#typeChart = renderChart(pointsStatistic, typeCtx, sortPointCount, 'count', (val) => `${val}x`);
    this.#timeChart = renderChart(pointsStatistic, timeCtx, sortPointDuration, 'duration', (val) => `${getDurationFormat(val)}`);
  }
}
