import _ from 'lodash';

/*
 * Helpers to create Readable Mongo Queries written in a functional style
 *
 * In it's current state they are very minimal and error prone.
 * They are only used for the guarded find.
 *
 * Feel free to expand these helpers.
**/

export const mergeFilters = (base, ...selectors) => {
  const newQuery = Object.assign({}, base);
  return _.reduce(selectors, (r, f) => {
    r = f(r);
    return r;
  }, newQuery);
}

export const assign = (base, ...options) => {
  base = base != null ? base : {};
  return Object.assign(base, ...options);
}

export const combine = (...filters) => (query) => {
  return mergeFilters(query, ...filters);
}
