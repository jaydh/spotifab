import { combineReducers } from 'redux';
import userReducer from './userReducer';
import playlistReducer from './playlistReducer';
import songsReducer from './songsReducer';
import albumsReducer from './albumsReducer';
import uiReducer from './uiReducer';
import browseReducer from './browseReducer';
import player from './player';

export default combineReducers({
  userReducer,
  playlistReducer,
  songsReducer,
  albumsReducer,
  uiReducer,
  browseReducer,
  player
});
