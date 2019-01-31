import { select, debounce, call, put, takeLatest } from "redux-saga/effects";
import { store } from "../index";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* playSong(action: any) {
  try {
    const { player, queue, token } = yield select();

    yield call(handlePlay, { player, queue, token });
    yield put({ type: "PLAY_SONG_SUCCESS" });
  } catch (e) {
    yield put({ type: "PLAY_SONG_FAILED", message: e.message });
  }
}
function* mySaga() {
  yield takeLatest("PLAY_SONG_REQUESTED", playSong);
  yield debounce(250, "NEXT_SONG", playSong);
  yield debounce(250, "PREV_SONG", playSong);
}

const handlePlay = async (action: any) => {
  const { player, queue, token } = action;

  if (player.spotifyReady) {
    window.player.pause();
  }
  if (player.youtubeReady) {
    window.ytPlayer.stopVideo();
  }
  const song = queue.queue[queue.position];
  song.youtube
    ? window.ytPlayer.loadVideoById(song.track.id)
    : apiPlay(token.token, {
        playerInstance: window.player,
        spotify_uri: [song.track.uri]
      });
};

const apiPlay = (
  token: string,
  {
    spotify_uri,
    playerInstance: {
      _options: { id }
    }
  }: any
) =>
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
    method: "PUT",
    body: JSON.stringify({ uris: spotify_uri }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

export default mySaga;
