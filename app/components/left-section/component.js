import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LeftSectionComponent extends Component {
  get timelineCategory() {
    let { timelineCategory } = this.args;
    return timelineCategory;
  }

  @action
  timelineChecked(timeline) {
    this.timelineCategory.map(cat => {
      cat.timeline.map(tl => {
        if (tl.id === timeline.id)
          tl.isChecked = !timeline.isChecked;
        else
          tl.isChecked = false;
      })
    })
  }
}
