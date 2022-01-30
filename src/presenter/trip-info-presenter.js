import { remove, render, RenderPosition } from '../render';
import TripInfoView from '../view/trip-info-view';


export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, pointsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
    this.#tripInfoComponent = new TripInfoView(this.#pointsModel.points);
    render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  destroy = () => {
    remove(this.#tripInfoComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  }

}
