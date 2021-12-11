import AbstractView from './abstract-view';

const createListEmptyTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class ListEmptyView extends AbstractView {
  get template() {
    return createListEmptyTemplate();
  }
}
