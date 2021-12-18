import { generatePoint } from './mock/point';
import TripPresenter from './presenter/trip-presenter';
//import EventCreateView from './view/event-create-view';

const POINT_COUNT = 6;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const mainElement = document.querySelector('.trip-main');
const headerElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const pageElement = document.querySelector('.page-main');
const eventElement = pageElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(headerElement, filterElement, eventElement);

tripPresenter.init(points);
//отрисовка формы добавления новой точки
//render(eventElement, new EventCreateView(points[0]).element, RenderPosition.BEFOREEND);
