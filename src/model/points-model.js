import { UpdateType } from '../const';
import AbstractObservable from '../utils/abstract-observable';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
      this.#offers = await this.#apiService.offers;
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add task');
    }
  }

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      city: point['destination']['name'],
      description: point['destination']['description'],
      startDate: new Date(point['date_from']),
      endDate: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
      pictures: point['destination']['pictures'],
      price: point['base_price'],
      typePoint: point['type'],
      offers: this.offers.find((offer) => offer.type === point['type']).offers
        .map((offer) => ({...offer, selected: !!point.offers.find((pointOffer) => pointOffer.id === offer.id)})),
    };

    delete adaptedPoint['destination'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['type'];

    return adaptedPoint;
  }
}
