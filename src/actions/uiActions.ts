export const setFilter = (filter: string) => {
  return {
    type: 'SET_FILTER',
    filter
  };
};

export const setSort = (sort: string) => {
  return {
    type: 'SET_SORT',
    sort
  };
};
