import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class RightSectionComponent extends Component {
  @service store;
  get timelineList() {

    return this.store.peekAll('timeline');
  }
}
