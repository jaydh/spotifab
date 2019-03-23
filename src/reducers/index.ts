import { combineReducers } from "redux";
import userReducer from "./userReducer";
import queue from "./queue";
import playlistReducer from "./playlistReducer";
import songsReducer from "./songsReducer";
import player from "./player";
import token from "./token";
import { persistReducer, persistCombineReducers } from "redux-persist";
import ui from "./ui";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["queue", "songsReducer", "token"]
};

const userConfig = {
  key: "userReducer",
  storage,
  whitelist: ["spotifyEnabled", "youtubeEnabled", "user"]
};

const playerConfig = {
  key: "player",
  storage,
  blacklist: ["playing", "spotifyReady", "youtubeReady"]
};

const appReducer = combineReducers({
  userReducer: persistReducer(userConfig, userReducer as any),
  playlistReducer,
  songsReducer,
  player: persistReducer(playerConfig, player),
  queue,
  token,
  ui
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return appReducer(state as any, action);
};
export default persistReducer(persistConfig, rootReducer as any);
