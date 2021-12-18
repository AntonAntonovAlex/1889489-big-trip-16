import { render, RenderPosition, updateItem } from '../render';
import FilterView from '../view/filter-view';
import ListEmptyView from '../view/list-empty-view';
import PointListView from '../view/point-list-view';
import SiteMenuView from '../view/site-menu-view';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter';

const POINT_COUNT = 6;

export default class TripPresenter {
  #headerContainer = null;
  #filterContainer = null;
  #tripContainer = null;

  #siteMenuComponent = new SiteMenuView();
  #filterComponent = new FilterView();
  #listEmptyComponent = new ListEmptyView();
  #sortComponent = new SortView();
  #pointListComponent = new PointListView();
  //#pointComponent = new PointView();

  #tripPoints = [];
  #pointPresenter = new Map();

  constructor(headerContainer, filterContainer, tripContainer) {
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];

    this.#renderSiteMenu();
    this.#renderFilter();
    this.#renderListPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderSiteMenu = () => {
    render(this.#headerContainer, this.#siteMenuComponent, RenderPosition.BEFOREEND);
  }

  #renderFilter = () => {
    render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
  }

  #renderListEmpty = () => {
    render(this.#tripContainer, this.#listEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    for (let i = 0; i < POINT_COUNT; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderListPoints = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderListEmpty();
    } else {
      this.#renderSort();
      this.#renderList();
      this.#renderPoints();
    }
  }

}
