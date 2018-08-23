import { combineReducers } from 'redux';
import userReducer from './userReducer';
import queue from './queue';
import playlistReducer from './playlistReducer';
import songsReducer from './songsReducer';
import albumsReducer from './albumsReducer';
import browseReducer from './browseReducer';
import player from './player';
import token from './token';
import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import ui from './ui';
import synced from './synced';
import * as localForage from 'localforage';

localForage.config({
  driver: localForage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'myApp',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'some description'
});

const persistConfig = {
  key: 'root',
  transforms: [immutableTransform()],
  storage: localForage,
  whitelist: ['queue', 'songsReducer', 'token', 'userReducer', 'ui']
};

const playerConfig = {
  key: 'player',
  transforms: [immutableTransform()],
  storage: localForage,
  blacklist: ['playing', 'spotifyReady', 'youtubeReady']
};
const appReducer = combineReducers({
  userReducer,
  playlistReducer,
  songsReducer,
  albumsReducer,
  browseReducer,
  player: persistReducer(playerConfig, player),
  queue,
  token,
  ui,
  synced
});
const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return appReducer(state, action);
};
export default persistReducer(persistConfig, rootReducer);
