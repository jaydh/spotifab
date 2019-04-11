import { select, call, put, takeLeading } from "redux-saga/effects";
import runSpotifySDK from "../bin/spotifySDK";
declare var Spotify: any;

function* initSpotify() {
  try {
    const { player, token } = yield select();

    yield call(handleInit, { player, token });
    yield put({ type: "INIT_SPOTIFY_SUCCESS" });
  } catch (e) {
    yield put({ type: "INIT_SPOTIFY_FAILED", message: e.message });
  }
}
function* mySaga() {
  yield takeLeading("INIT_SPOTIFY_REQUESTED", initSpotify);
}

export const handleInit = async (action: any) => {
  const { player, token } = action;
  const { spotifyReady } = player;

  return spotifyReady
    ? Promise.resolve()
    : Promise.resolve(runSpotifySDK()).then(() => setupSpotify(player, token));
};

const setupSpotify = (player: any, token: { token: string }) => {
  return new Promise((resolve, reject) => {
    const onReady = () => {
      window.player.setVolume(player.muted ? 0 : player.volume / 100);
      resolve();
    };

    window.onSpotifyWebPlaybackSDKReady = () => {
      window.player = new Spotify.Player({
        name: "bard",
        getOAuthToken: (cb: any) => {
          cb(token.token);
        }
      });

      // Error handling
      window.player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
        reject();
      });
      window.player.addListener("authentication_error", ({ message }: any) => {
        console.log("add");
      });
      window.player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      window.player.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });

      // Playback status updates
      window.player.addListener("player_state_changed", (state: any) => {});

      // Ready
      window.player.addListener("ready", ({ device_id }: any) => {
        onReady();
      });

      // Not Ready
      window.player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      window.player.connect();
    };
  });
};
export default mySaga;
