const _ = require('lodash');

export const getArticleList = list =>
  (list === undefined ? [] : removeExpiredItem(list));

export const removeExpiredItem = (list) => {
  _.remove(list, item => item.expire);
  return list || [];
};

export const removeItemById = (itemId,list) => {
  _.remove(list, item => itemId==item.id);
  return list || [];
};

export const getTypeName = (topicList, topicId) =>
  _.head(_.filter(topicList, o => o.id === topicId.toString())).name;

/**
 * filter duplicate data when loading more.
*/
export const concatFilterDuplicateArticles = (list1, list2) => {
  const set = new Set(list1.map(item => item.content_type+item.id));
  const filterList2 = [];
  const length = list2.length;
  for (let i = 0; i < length; i++) {
    if (!set.has(list2[i].content_type+list2[i].id)) {
      filterList2.push(list2[i]);
    }
  }
  return list1.concat(filterList2);
};

/**
 * filter duplicate data when loading more.
*/
export const concatFilterDuplicate = (list1, list2) => {
  const set = new Set(list1.map(item => item.id));
  const filterList2 = [];
  const length = list2.length;
  for (let i = 0; i < length; i++) {
    if (!set.has(list2[i].id)) {
      filterList2.push(list2[i]);
    }
  }
  return list1.concat(filterList2);
}

