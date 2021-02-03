import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from "@ember/array";

function timestamp(date, type) {
  let fullDate = new Date(date);
  if (type === "year") {
    return fullDate.getFullYear();
  } else if (type === "month")
    return fullDate.getMonth() + 1;
  else if (type === "date")
    return fullDate.getDate();
  else if (type === "day")
    return fullDate.getDay() + 1
}

function getPercent(value, first, last) {
  return parseInt(((value - first) / (last - first)) * 100);
}

export default class TimelineModel extends Model {

  @attr('string') name;
  @attr('string') tblName;
  @attr() filter;
  @attr('string') columnName;
  @attr('string') defaultStyleColumn;

  @attr('boolean', { defaultValue: false }) dependency;
  @attr('string') dependencyDataset;
  @attr('boolean', { defaultValue: false }) isChecked;
  @attr('boolean', { defaultValue: false }) mbtileStatus;
  @attr('string') featureType;
  @attr('string') styleType;
  @attr() styleGroup;
  @attr() style;
  @belongsTo('timeline-category') timelineCategory;

  @computed
  get filterData() {
    if (isEmpty(this.filter)) return false;
    let topfilter = A();

    this.filter.forEach(filter => {
      const filterOptions = filter.filter_data;
      let filterData = A();
      let counter = 0;

      if (filter.type === 'dropdown' && !filter.filter_from_column) {
        filterData.push(EmberObject.create({
          key: 'All',
          value: '',
          isSelected: true
        }))
      }

      for (let prop in filterOptions) {
        if (filterOptions.hasOwnProperty(prop)) {
          filterData.push(EmberObject.create({
            key: prop,
            value: filterOptions[prop],
            isSelected: filter.filter_from_column ? ((this.defaultStyleColumn === prop) ? true : false) : (((counter === Object.keys(filterOptions).length) && filter.type === 'dropdown') ? true : false),
            type: filter.type
          }))
        }
        counter++;
      }

      if (filter.type === "range") {
        topfilter.push(EmberObject.create({
          name: filter.name,
          isSelected: false,
          slug: filter.slug,
          filterColumn: filter.filter_column,
          type: filter.type,
          range: [filterOptions.min, filterOptions.max],
          rangeSelected: [filterOptions.min, filterOptions.max],
          originalrange: [filterOptions.min, filterOptions.max],
          filterByColumn: filter.filter_from_column
        }))
      } else if (filter.type === "dropdown") {
        let selected = filter.filter_from_column ? this.defaultStyleColumn : '';
        topfilter.push(EmberObject.create({
          name: filter.name,
          isSelected: false,
          slug: filter.slug,
          selectedValue: selected,
          filterColumn: filter.filter_column,
          data: filterData,
          type: filter.type,
          filterByColumn: filter.filter_from_column
        }))
      } else if (filter.type === "checkbox") {
        topfilter.push(EmberObject.create({
          name: filter.name,
          isSelected: false,
          slug: filter.slug,
          selectedValue: "",
          filterColumn: filter.filter_column,
          data: filterData,
          type: filter.type,
          filterByColumn: filter.filter_from_column
        }))
      }
    })
    return topfilter;
  };

  @computed
  get dateRangeFilter() {
    if (isEmpty(this.filter)) return false;
    let topfilter = A();
    this.filter.forEach(filter => {
      // const filter = data[index];
      const filterOptions = filter.filter_data;
      let rangeSelected = A([null, null]);
      if (filter.range_type === "single" || filter.range_type === "census")
        rangeSelected = A([null]);
      if (filter.type === "daterange") {
        if (filter.range_type === "census") {
          let range = {};
          if (filter.display_type === "yearly") {
            filterOptions.forEach((item, index) => {
              if (index === 0) {
                range["min"] = timestamp(item, 'year');
              } else if (index === filterOptions.length - 1) {
                range["max"] = timestamp(item, 'year');
              } else {
                let percent = getPercent(timestamp(item, 'year'), timestamp(filterOptions[0], 'year'), timestamp(filterOptions[filterOptions.length - 1], 'year'))
                range[percent + "%"] = timestamp(item, 'year')
              }
            })
            rangeSelected = A([timestamp(filterOptions[0], 'year')]);
          }
          topfilter.push(EmberObject.create({
            name: filter.name,
            isSelected: false,
            slug: filter.slug,
            type: filter.type,
            filterColumn: filter.filter_column,
            rangeType: filter.range_type,
            displayType: filter.display_type,
            range: range,
            rangeSelected: rangeSelected,
            originalrange: [filterOptions[0], filterOptions[filterOptions.length - 1]],
            filterByColumn: filter.filter_from_column
          }))
        } else {
          topfilter.push(EmberObject.create({
            name: filter.name,
            isSelected: false,
            slug: filter.slug,
            type: filter.type,
            filterColumn: filter.filter_column,
            displayType: filter.display_type,
            rangeType: filter.range_type,
            range: [filterOptions.min, filterOptions.max],
            rangeSelected: rangeSelected,
            originalrange: [filterOptions.min, filterOptions.max],
            filterByColumn: filter.filter_from_column
          }))
        }
      }
    })
    return topfilter;
  };

  @computed
  get showMbtileStatus() {
    return this.mbtileStatus || this.dependency;
  };
}
