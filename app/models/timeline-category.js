import Model, { attr, hasMany } from '@ember-data/model';

export default class TimelineCategoryModel extends Model {
   @attr('string') name;
   @attr('string') position;
   @attr('number') parentId;
   @attr('boolean', { defaultValue: false }) isChecked;
   @hasMany('timeline') timeline;
   @hasMany('timeline-category', {inverse: 'subcategory'}) subcategory;

   get isParentCategory() {
    return this.parentId === null ? true : false;
  }
}
