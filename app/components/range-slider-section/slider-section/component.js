import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { set, action, computed } from '@ember/object';
import { later } from '@ember/runloop';
// import { inject as service } from '@ember/service';
import { A } from '@ember/array';

function timestamp(date, type) {
  let fullDate = new Date(date);
  if (type === "year")
    return fullDate.getFullYear();
  else if (type === "month")
    return fullDate.getMonth();
  else if (type === "date")
    return fullDate.getDate();
  else if (type === "day")
    return fullDate.getDay()
};

function getMonthDiff(month1, month2) {
  let monthCount;
  monthCount = (timestamp(month2, "year") - timestamp(month1, "year")) * 12;
  monthCount -= timestamp(month1, "month");
  monthCount += timestamp(month2, "month");
  return monthCount
};

export default class RangeSliderSliderSectionComponent extends Component {

  @tracked step = 1;

  monthList = A(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]);

  @computed
  get filterData() {
    let { filterData } = this.args;
    return filterData;
  }

  @computed
  get timeline() {
    let { timeline } = this.args;
    return timeline;
  }

  // @computed
  // get rangeSelected() {
  //   return this.filterData.rangeSelected;
  // }
  // @tracked rangeSelected = this.filterData.rangeSelected;

  get range() {
    let originalDate = this.filterData.originalrange;
    if (this.filterData.displayType === "yearly") {
      return {
        min: timestamp(originalDate[0], "year"),
        max: timestamp(originalDate[1], "year")
      }
    } else {
      return {
        min: getMonthDiff(originalDate[0], originalDate[0]),
        max: getMonthDiff(originalDate[0], originalDate[1])
      }
    }

  };

  @computed
  get start() {
    let seletedDate = this.filterData.range;
    let originalDate = this.filterData.originalrange;
    if (this.filterData.displayType === "yearly") {
      return A([timestamp(seletedDate[0], "year"), timestamp(seletedDate[1], "year")])
    } else {
      return A([getMonthDiff(originalDate[0], seletedDate[0]), getMonthDiff(originalDate[0], seletedDate[1])]);
    }

  };

  get startText() {
    let seletedDate = this.filterData.range;
    let originalDate = this.filterData.originalrange;
    if (this.filterData.displayType === "yearly") {
      return A([timestamp(seletedDate[0], "year"), timestamp(seletedDate[1], "year")]);
    } else {
      return A([timestamp(originalDate[0], "year") + " " + this.monthList[timestamp(originalDate[0], "month")],
      timestamp(originalDate[1], "year") + " " + this.monthList[timestamp(originalDate[1], "month")]])
    }

  };



  @action
  changedAction(event) {

    set(this, "timeline.showMbtileStatus", false);
    later(() => {
      event = A([parseInt(event[0].toFixed(0)), parseInt(event[1].toFixed(0))]);
      set(this, "filterData.rangeSelected", event);
      set(this, "timeline.showMbtileStatus", true);
    })
  }
}
