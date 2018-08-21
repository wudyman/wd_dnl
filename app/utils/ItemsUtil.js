const _ = require('lodash');

export const getArticleList = list =>
  (list === undefined ? [] : removeExpiredItem(list));

export const removeExpiredItem = (list) => {
  _.remove(list, item => item.expire);
  return list || [];
};

export const getTypeName = (topicList, topicId) =>
  _.head(_.filter(topicList, o => o.id === topicId.toString())).name;
