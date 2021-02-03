import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class RangeSliderComponent extends Component {
  @service store;

  get timelineList() {
    return this.store.peekAll('timeline');
  }
}
