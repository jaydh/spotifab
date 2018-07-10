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

export default combineReducers({
  userReducer,
  playlistReducer,
  songsReducer,
  albumsReducer,
  uiReducer,
  browseReducer,
  player,
  queue,
  token
});
