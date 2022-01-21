import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition /*updateItem*/ } from '../render';
import { filter } from '../utils/filter';
import { sortPointDate, sortPointPrice, sortPointTime } from '../utils/utils';
//import FilterView from '../view/filter-view';
import ListEmptyView from '../view/list-empty-view';
import PointListView from '../view/point-list-view';
import SiteMenuView from '../view/site-menu-view';
import SortView from '../view/sort-view';
import PointNewPresenter from './point-new-presenter';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #headerContainer = null;
  //#filterContainer = null;
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #siteMenuComponent = new SiteMenuView();
  //#filterComponent = new FilterView('everything');
  #listEmptyComponent = null;;
  //#sortComponent = new SortView();
  #pointListComponent = new PointListView();
  #sortComponent = null;

  //#tripPoints = [];
  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  //#sourcedTripPoints = [];

  constructor(headerContainer, tripContainer, pointsModel, filterModel) {
    this.#headerContainer = headerContainer;
    //this.#filterContainer = filterContainer;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    //const filterType = this.#filterModel.filter;
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        //return [...this.#pointsModel.points].sort(sortPointPrice);
        return filteredPoints.sort(sortPointPrice);
      case SortType.TIME:
        //return [...this.#pointsModel.points].sort(sortPointTime);
        return filteredPoints.sort(sortPointTime);
      case SortType.DATE:
        return filteredPoints.sort(sortPointDate);
    }

    //return this.#pointsModel.points;
    return filteredPoints.sort(sortPointDate);
    //return filteredPoints;
  }

  init = () => {
    //this.#tripPoints = [...tripPoints];
    //this.#sourcedTripPoints = [...tripPoints];

    this.#renderSiteMenu();
    //this.#renderFilter();
    this.#renderListPoints();
  }

  createPoint = () => {
    this.#currentSortType = SortType.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init();
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  /*#handlePointChange = (updatedPoint) => {
    //this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    //this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }*/
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearListPoints();
        this.#renderListPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearListPoints({resetSortType: true});
        this.#renderListPoints();
        break;
    }
  }

  #renderSiteMenu = () => {
    render(this.#headerContainer, this.#siteMenuComponent, RenderPosition.BEFOREEND);
  }

  /*#renderFilter = () => {
    render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }*/

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#tripContainer, this.#listEmptyComponent, RenderPosition.BEFOREEND);
  }

  /*#sortPoint = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#tripPoints.sort(sortPointPrice);
        break;
      case SortType.TIME:
        this.#tripPoints.sort(sortPointTime);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }*/

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    //this.#sortPoint(sortType);
    this.#currentSortType = sortType;
    //this.#clearPointList();
    //this.#renderPoints();
    this.#clearListPoints();
    //console.log('clear');
    this.#renderListPoints();
  }

  #renderSort = () => {
    //render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  /*#renderPoints = () => {
    for (let i = 0; i < POINT_COUNT; i++) {
      this.#renderPoint(this.points[i]);
    }
  }*/

  /*#clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }*/

  #clearListPoints = ({resetSortType = false} = {}) => {
    //const taskCount = this.tasks.length;

    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    //remove(this.#listEmptyComponent);
    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    /*if (resetRenderedPointCount) {
      this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedTaskCount = Math.min(taskCount, this.#renderedTaskCount);
    }*/

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderListPoints = () => {
    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderListEmpty();
    } else {
      this.#renderSort();
      this.#renderList();
      //this.#renderPoints();
      for (let i = 0; i < pointCount; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  }

}
