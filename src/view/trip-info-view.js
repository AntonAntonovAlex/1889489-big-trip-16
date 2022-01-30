import dayjs from 'dayjs';
import { sortPointDate } from '../utils/utils';
import AbstractView from './abstract-view';

const createTripInfoTemplate = (points) => {
  const sortedPoints = [...points].sort(sortPointDate);
  const pointsCount = sortedPoints.length;
  const firstPoint = sortedPoints[0];
  const lastPoint = sortedPoints[pointsCount - 1];
  let pricePoint = 0;
  let cities = new Set();

  sortedPoints.forEach((point) => {
    pricePoint += point.price;
    cities.add(point.city);
    point.offers.forEach((offer) => {
      pricePoint += offer.selected ? offer.price : 0;
    });
  });
  const priceAllPoints = pricePoint;
  cities = Array.from(cities);
  const intermediateCity = cities.length > 3 ? '...' : cities[1];

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${firstPoint.city} &mdash; ${intermediateCity} &mdash; ${lastPoint.city}</h1>

      <p class="trip-info__dates">${dayjs(firstPoint.startDate).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(lastPoint.endDate).format('MMM D')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${priceAllPoints}</span>
    </p>
  </section>`
  );
};
export default class TripInfoView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createTripInfoTemplate(this._data);
  }
}
