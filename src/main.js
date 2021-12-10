import { generatePoint } from './mock/point';
import { render, RenderPosition } from './render';
//import EventCreateView from './view/event-create-view';
import EventEditView from './view/event-edit-view';
import FilterView from './view/filter-view';
import SiteMenuView from './view/site-menu-view';
import SortView from './view/sort-view';
import PointView from './view/point-view';
import PointListView from './view/point-list-view';
import ListEmptyView from './view/list-empty-view';

const POINT_COUNT = 6;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const mainElement = document.querySelector('.trip-main');
const headerElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const pageElement = document.querySelector('.page-main');
const eventElement = pageElement.querySelector('.trip-events');

const renderPoint = (pointElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EventEditView(point);

  const replacePointToForm = () => {
    pointElement.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    pointElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointElement, pointComponent.element, RenderPosition.BEFOREEND);
};

render(headerElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(filterElement, new FilterView().element, RenderPosition.AFTERBEGIN);

if (points.length === 0) {
  render(eventElement, new ListEmptyView().element, RenderPosition.BEFOREEND);
} else {
  render(eventElement, new SortView().element, RenderPosition.BEFOREEND);
  const pointListComponent = new PointListView();
  render(eventElement, pointListComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent.element, points[i]);
  }
}

//отрисовка формы добавления новой точки
//render(eventElement, new EventCreateView(points[0]).element, RenderPosition.BEFOREEND);
