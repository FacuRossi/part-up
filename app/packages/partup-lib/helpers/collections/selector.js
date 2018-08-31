import _ from 'lodash';
import { assign } from './index';

const makeSelector = (selector) => (key) => (value) => (query) => {
  return Object.assign(query, {
    [key]: {
      [selector]: value,
    },
  });
}

const makeExists = makeSelector('$exists');
const makeIn = makeSelector('$in');

const makeAnd = (...filters) => (query) => {
  return assign(query,
    _.reduce(filters, (r, f) => {
      r['$and'].push(f({}));
      return r;
    }, {
      $and: query['$and'] || [],
    }),
  );
}

export const idIn = makeIn('_id');

export const isNotDeleted = makeExists('deletedAt')(false);
export const isNotDeactivated = makeExists('deactivatedAt')(false);

export const isActive = makeAnd(
  isNotDeleted,
  isNotDeactivated,
);
