import { List } from 'immutable';
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

export const setSongSelection = (data: {
  up?: number;
  down?: number;
  selectedSongs?: List<any>;
}) => {
  return {
    type: 'SET_SONG_SELECTION',
    upSelector: data.up,
    downSelector: data.down,
    selectedSongs: data.selectedSongs
  };
};
