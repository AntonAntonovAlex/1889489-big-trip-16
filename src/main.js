import { generatePoint } from './mock/point';
import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';
//import EventCreateView from './view/event-create-view';

const POINT_COUNT = 6;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();

const mainElement = document.querySelector('.trip-main');
const headerElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const pageElement = document.querySelector('.page-main');
const eventElement = pageElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(headerElement, eventElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel );

tripPresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
  document.querySelector('.trip-main__event-add-btn').disabled = true;
});
//отрисовка формы добавления новой точки
//render(eventElement, new EventCreateView(points[0]).element, RenderPosition.BEFOREEND);
