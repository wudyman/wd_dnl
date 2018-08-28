/**
 *
 * Copyright 2016-present wd_dnl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
export const formatDateString = (timestamp) => {
  if (timestamp === undefined) {
    return '';
  }
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatStringWithHtml = (originString) => {
  if (originString === undefined) {
    return '';
  }
  const newString = originString
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return newString;
};

/**
 * filter duplicate data when loading more.
*/
export const concatFilterDuplicateTopics = (list1, list2) => {
  const set = new Set(list1.map(item => item.id));
  const filterList2 = [];
  const length = list2.length;
  for (let i = 0; i < length; i++) {
    if (!set.has(list2[i].id)) {
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
