import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../render';
import { filter } from '../utils/filter';
import { sortPointDate, sortPointPrice, sortPointTime } from '../utils/utils';
import ListEmptyView from '../view/list-empty-view';
import LoadingView from '../view/loading-view';
import PointListView from '../view/point-list-view';
import SortView from '../view/sort-view';
import PointNewPresenter from './point-new-presenter';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listEmptyComponent = null;;
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    //const destinations = this.#pointsModel.destinations;
    //console.log('с сервера destinations -', this.destinations);

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent, this.#handleViewAction);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);
      case SortType.DATE:
        return filteredPoints.sort(sortPointDate);
    }
    return filteredPoints.sort(sortPointDate);
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderListPoints();
  }

  destroy = () => {
    this.#clearListPoints({resetSortType: true});

    remove(this.#pointListComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(this.destinations, this.offers);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderListPoints();
        break;
    }
  }

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#tripContainer, this.#listEmptyComponent, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearListPoints();
    this.#renderListPoints();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.destinations, this.offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearListPoints = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#loadingComponent);
    remove(this.#sortComponent);

    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderListPoints = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderListEmpty();
    } else {
      this.#renderSort();
      this.#renderList();
      for (let i = 0; i < pointCount; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  }

}
