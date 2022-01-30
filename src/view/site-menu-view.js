import { MenuItem } from '../const';
import AbstractView from './abstract-view';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn--active" id="${MenuItem.TABLE}" href="#">Table</a>
  <a class="trip-tabs__btn" id="${MenuItem.STATISTICS}" href="#">Stats</a>
</nav>`
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target);
  }
}
