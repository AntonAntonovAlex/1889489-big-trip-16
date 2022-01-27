import ApiService from './api-service';
import { MenuItem } from './const';
//import { generatePoint } from './mock/point';
import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';
import { remove, render, RenderPosition } from './render';
import SiteMenuView from './view/site-menu-view';
import StatisticsView from './view/statistics-view';

//const POINT_COUNT = 6;
const AUTHORIZATION = 'Basic sgu9et8yodgt7o5';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

//const points = Array.from({length: POINT_COUNT}, generatePoint);
//console.log('моковая точка - ', points[0]);

//const pointsModel = new PointsModel();
const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
//pointsModel.points = points;

const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView();

const mainElement = document.querySelector('.trip-main');
const headerElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const pageElement = document.querySelector('.page-main');
const eventElement = pageElement.querySelector('.trip-events');
const eventAddButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(eventElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel);

let statisticsComponent = null;
let activeMenuItem = MenuItem.TABLE;

//render(headerElement, siteMenuComponent, RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  if (menuItem.id === activeMenuItem) {
    return;
  }
  headerElement.querySelectorAll('.trip-tabs__btn').forEach((button) => button.classList.remove('trip-tabs__btn--active'));
  menuItem.classList.add('trip-tabs__btn--active');
  activeMenuItem = menuItem.id;
  switch (menuItem.id) {
    case MenuItem.TABLE:
      filterPresenter.init();
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.points);
      render(eventElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

//siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripPresenter.init();
filterPresenter.init();

pointsModel.init().finally(() => {
  render(headerElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

  eventAddButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    remove(statisticsComponent);
    filterPresenter.destroy();
    filterPresenter.init();
    tripPresenter.destroy();
    tripPresenter.init();
    tripPresenter.createPoint();
    eventAddButton.disabled = true;
    activeMenuItem = MenuItem.TABLE;
    headerElement.querySelector(`[id=${MenuItem.TABLE}]`)?.classList.add('trip-tabs__btn--active');
    headerElement.querySelector(`[id=${MenuItem.STATISTICS}]`)?.classList.remove('trip-tabs__btn--active');
  });
});
