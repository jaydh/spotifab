import playSong from "./playSong";
import initSpotify from "./initSpotify";
import initYoutube from "./initYoutube";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([playSong(), initSpotify(), initYoutube()]);
}
