import { FilterType } from '../const';
import AbstractView from './abstract-view';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createListEmptyTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
     ${noPointTextValue}
     </p>`
  );
};

export default class ListEmptyView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createListEmptyTemplate(this._data);
  }
}
