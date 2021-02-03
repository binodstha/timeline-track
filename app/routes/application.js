import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  async model() {
    return {
      timelineCategory: this.store.findAll('timeline-category')
    }
  }
}
