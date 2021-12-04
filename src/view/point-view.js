import dayjs from 'dayjs';

const formatTime = (time) => (String(time).length === 1) ? `0${time}` : time;

const getDuration = (startDate, endDate) => {
  const days = dayjs(endDate).diff(startDate, 'd');
  const hours = dayjs(endDate).diff(startDate, 'h') - days*24;
  const minutes = dayjs(endDate).diff(startDate, 'm') - days*24*60 - hours*60;

  if (days === 0 && hours === 0) {
    return `${formatTime(minutes)}M`;
  }

  if (days === 0 ) {
    return `${formatTime(hours)}H ${formatTime(minutes)}M`;
  }

  return `${formatTime(days)}D ${formatTime(hours)}H ${formatTime(minutes)}M`;
};

const createEventOffer = (offers) => {
  let offerTemplate = '';
  if (offers.length === 0) {
    return offerTemplate;
  }
  offers.forEach((offer) => {
    offerTemplate += `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;
  });
  return offerTemplate;
};

export const createPointTemplate = (point) => {
  const {endDate, startDate, price, destinationCity, isFavorite, typePoint, offers} = point;
  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(startDate).format('YYYY-MM-D')}">${dayjs(startDate).format('MMM D')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${typePoint.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${typePoint} ${destinationCity}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(startDate).format('YYYY-MM-DTHH:mm')}">${dayjs(startDate).format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(endDate).format('YYYY-MM-DTHH:mm')}">${dayjs(endDate).format('HH:mm')}</time>
      </p>
      <p class="event__duration">${getDuration(startDate, endDate)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createEventOffer(offers)}
    </ul>
    <button class="event__favorite-btn  ${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};
