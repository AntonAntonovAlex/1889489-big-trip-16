import { RenderPosition, renderTemplate } from "./render";
import { createEventTemplate } from "./view/event-create-view";
import { createEventEditTemplate } from "./view/event-edit-view";
import { createFilterTemplate } from "./view/filter-view";
import { createPointTemplate } from "./view/point-view";
import { createSiteMenuTemplate } from "./view/site-menu-view";
import { createSortTemplate } from "./view/sort-view";

const POINT_COUNT = 3;

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const sitePageElement = document.querySelector('.page-main');
const siteEventElement = sitePageElement.querySelector('.trip-events');


renderTemplate(siteHeaderElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilterElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteEventElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteEventElement, createEventTemplate(), RenderPosition.AFTEREND);
renderTemplate(siteEventElement, createEventEditTemplate(), RenderPosition.BEFOREEND);
for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(siteEventElement, createPointTemplate(), RenderPosition.AFTEREND);
}
