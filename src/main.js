import { generatePoint } from './mock/point';
import { RenderPosition, renderTemplate } from './render';
import { createEventTemplate } from './view/event-create-view';
import { createEventEditTemplate } from './view/event-edit-view';
import { createFilterTemplate } from './view/filter-view';
import { createPointTemplate } from './view/point-view';
import { createSiteMenuTemplate } from './view/site-menu-view';
import { createSortTemplate } from './view/sort-view';

const POINT_COUNT = 6;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const mainElement = document.querySelector('.trip-main');
const headerElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const pageElement = document.querySelector('.page-main');
const eventElement = pageElement.querySelector('.trip-events');

renderTemplate(headerElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filterElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(eventElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(eventElement, createEventTemplate(points[1]), RenderPosition.AFTEREND);
renderTemplate(eventElement, createEventEditTemplate(points[0]), RenderPosition.BEFOREEND);

for (let i = 2; i < POINT_COUNT; i++) {
  renderTemplate(eventElement, createPointTemplate(points[i]), RenderPosition.AFTEREND);
}
