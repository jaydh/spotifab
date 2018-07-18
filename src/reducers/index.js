import { combineReducers } from 'redux';
import userReducer from './userReducer';
import queue from './queue';
import playlistReducer from './playlistReducer';
import songsReducer from './songsReducer';
import albumsReducer from './albumsReducer';
import uiReducer from './uiReducer';
import browseReducer from './browseReducer';
import player from './player';
import token from './token';
import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  transforms: [immutableTransform()],
  storage,
  whitelist: ['queue', 'songsReducer', 'userReducer']
};

const playerConfig = {
  key: 'player',
  transforms: [immutableTransform()],
  storage,
  blacklist: ['playing', 'spotifyReady', 'youtubeReady']
};
const rootReducer = combineReducers({
  userReducer,
  playlistReducer,
  songsReducer,
  albumsReducer,
  uiReducer,
  browseReducer,
  player: persistReducer(playerConfig, player),
  queue,
  token
});

export default persistReducer(persistConfig, rootReducer);
