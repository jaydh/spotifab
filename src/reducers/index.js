import { combineReducers } from 'redux';
import userReducer from './userReducer';
import queue from './queue';
import playlistReducer from './playlistReducer';
import songsReducer from './songsReducer';
import player from './player';
import token from './token';
import { persistReducer } from 'redux-persist';
import ui from './ui';
import synced from './synced';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['queue', 'songsReducer', 'token', 'ui']
};

const userConfig = {
  key: 'userReducer',
  storage: storage,
  whitelist: ['youtubeEnabled', 'spotifyEnabled', 'soundcloudEnabled']
};

const playerConfig = {
  key: 'player',
  storage: storage,
  blacklist: ['playing', 'spotifyReady', 'youtubeReady']
};

const uiConfig = {
  key: 'ui',
  storage: storage,
  blacklist: ['firebaseLoaded', 'queueOpen', 'sideMenuOpen']
};
const appReducer = combineReducers({
  userReducer: persistReducer(userConfig, userReducer),
  playlistReducer,
  songsReducer,
  player: persistReducer(playerConfig, player),
  queue,
  token,
  ui: persistReducer(uiConfig, ui),
  synced
});
const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return appReducer(state, action);
};
export default persistReducer(persistConfig, rootReducer);
