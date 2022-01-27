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

    /*this.#apiService.points.then((points) => {
      console.log('с сервера', points[1]);
      console.log(points.map(this.#adaptToClient));
    });*/

    /*this.#apiService.destinations.then((destinations) => {
      this.#destinations = destinations;
      console.log('с сервера destinations -', destinations);
    });*/

    //console.log('с сервера destinations -', this.#destinations);

    /*this.#apiService.offers.then((offers) => {
      console.log('с сервера offers -', offers);
    });*/
  }

  /*set points(points) {
    this.#points = [...points];
  }*/

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
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptToClient);
      //console.log('this.#points - ', this.#points);
      this.#destinations = await this.#apiService.destinations;
      this.#offers = await this.#apiService.offers;
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

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
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
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['destination'];
    //delete adaptedPoint['destination']['name'];
    //delete adaptedPoint['destination']['description'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    //delete adaptedPoint['destination']['pictures'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['type'];

    return adaptedPoint;
  }
}
