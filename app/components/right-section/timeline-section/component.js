import Component from '@glimmer/component';

export default class RightSectionTimelineSectionComponent extends Component {
  get rangeFilter() {
    let { rangeFilter } = this.args;
    return rangeFilter.rangeSelected
  }
}
