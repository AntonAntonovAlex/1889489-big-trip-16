import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart-view';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createListCities = (destinations) => (`
${destinations.map((destination) => `<option value="${destination.name}"></option>`)}
`);

const createEventPhotos = (photos) => (`
${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`)}
`);

const createEventTypeList = (typePoint, offerTypes) => (
  `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${offerTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}"
    ${(typePoint === type.toLowerCase()) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`).join('')}
  </fieldset>
</div>`
);

const createEventOffers = (pointOffers) => (`<section class="event__section  event__section--offers">
${(pointOffers.length === 0) ? '' : `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
<div class="event__available-offers">
  ${pointOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="${offer.id}"
    ${offer.selected ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('')}

</div>`}

</section>`);

const createEventEditTemplate = (data, destinations, offers) => {
  const {endDate, startDate, price, typePoint, city, isDisabled, isSaving, isDeleting} = data;
  const pointDestination = destinations.find((destination) => destination.name === city);
  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        ${`<img class="event__type-icon" width="17" height="17" src="img/icons/${typePoint.toLowerCase()}.png" alt="Event type icon"></img>`}

      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
      ${createEventTypeList(typePoint, offers.map((offerType) => offerType.type))}

    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${typePoint}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
      ${createListCities(destinations)}

      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
    ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
    ${isDeleting ? 'Deleting...' : 'Delete'}
    </button>

    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">

  ${createEventOffers(data.offers)}
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination"> Destination</h3>
      <p class="event__destination-description">
      ${pointDestination.description}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">

        ${createEventPhotos(pointDestination.pictures)}
        </div>
      </div>
    </section>
  </section>
</form>`;
};

export default class EventEditView extends SmartView {
  #startdatepicker = null;
  #enddatepicker = null;

  constructor(point, destinations, offers) {
    super();
    this._data = EventEditView.parsePointToData(point);
    this._destinations = destinations;
    this._offers = offers;

    this.setEventToggleHandler();
    this.setPriceToggleHandler();
    this.setCityToggleHandler();
    this.setOfferToggleHandler();
    this.#setDatepicker();
  }

  get template() {
    return createEventEditTemplate(this._data, this._destinations, this._offers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#startdatepicker) {
      this.#startdatepicker.destroy();
      this.#startdatepicker = null;
    }

    if (this.#enddatepicker) {
      this.#enddatepicker.destroy();
      this.#enddatepicker = null;
    }
  }

  reset = (point) => {
    this.updateData(
      EventEditView.parsePointToData(point),
    );
  }

  restoreHandlers = () => {
    this.setEventToggleHandler();
    this.setPriceToggleHandler();
    this.setOfferToggleHandler();
    this.setCityToggleHandler();
    this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setRemoveClickHandler(this._callback.editClick);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  setRemoveClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setEventToggleHandler = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventToggleHandler);
  }

  setPriceToggleHandler = () => {
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceToggleHandler);
  }

  setOfferToggleHandler = () => {
    this.element.querySelectorAll('.event__offer-checkbox').forEach((element) => {
      element.addEventListener('change', this.#offerToggleHandler);
    });
  }

  setCityToggleHandler = () => {
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#cityToggleHandler);
  }

  #setDatepicker = () => {
    this.#startdatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._data.endDate,
        defaultDate: this._data.startDate,
        onChange: this.#startDateChangeHandler,
      },
    );

    this.#enddatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._data.startDate,
        defaultDate: this._data.endDate,
        onChange: this.#endDateChangeHandler,
      },
    );
  }

  #startDateChangeHandler = ([userDate]) => {
    this.updateData({
      startDate: userDate,
    });
  }

  #endDateChangeHandler = ([userDate]) => {
    this.updateData({
      endDate: userDate,
    });
  }


  #cityToggleHandler = (evt) => {
    evt.preventDefault();
    const cities = this._destinations.map((destination) => destination.name);
    if (!cities.includes(evt.target.value)) {
      evt.target.value = this._data.city;
    }
    const cityName = evt.target.value;
    const currentDestination = this._destinations.find((destination) => destination.name === cityName);
    this.updateData({
      city : cityName,
      description: currentDestination.description,
      pictures: currentDestination.pictures,
    });
  }

  #eventToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      typePoint : evt.target.value,
      offers : this._offers.find((offer) => offer.type === evt.target.value).offers,
    });
  }

  #priceToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      price : evt.target.value,
    });
  }

  #offerToggleHandler = (evt) => {
    evt.preventDefault();
    this._data.offers.find((offer) => offer.id === +evt.target.name).selected = evt.target.checked;
    this.updateData({
      offers : this._data.offers,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._data.price = +this.element.querySelector('.event__input--price').value;
    this.element.querySelectorAll('.event__offer-checkbox').forEach((element) => {
      this._data.offers[element.name-1].selected = element.checked;
    });
    this._callback.formSubmit(EventEditView.parseDataToPoint(this._data));
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseDataToPoint(this._data));
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  static parsePointToData = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
    offers: point.offers.map((offer) => ({...offer})),
  });

  static parseDataToPoint = (data) => {
    const point = {...data};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };

}
