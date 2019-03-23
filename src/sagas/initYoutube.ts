import { select, call, put, takeLatest } from "redux-saga/effects";
import runAPI from "../bin/youtubeAPI";
declare var YT: any;

function* initYoutube() {
  try {
    const { player } = yield select();
    yield call(handleInit, { player });
    yield put({ type: "INIT_YOUTUBE_SUCCESS" });
  } catch (e) {
    yield put({ type: "INIT_YOUTUBE_FAILED", message: e.message });
  }
}
function* mySaga() {
  yield takeLatest("INIT_YOUTUBE_REQUESTED", initYoutube);
}

const handleInit = async (action: any) => {
  const { player, token } = action;
  const { youtubeReady } = player;
  return youtubeReady
    ? Promise.resolve()
    : Promise.resolve(runAPI()).then(() => setupYoutube(player));
};

const setupYoutube = (player: any) => {
  return new Promise((resolve, reject) => {
    const onPlayerReady = (event: any) => {
      window.ytPlayer.setVolume(player.muted ? 0 : player.volume);
      resolve();
    };

    const onPlayerStateChange = (event: any) => {};

    window.onYouTubeIframeAPIReady = () => {
      window.ytPlayer = new YT.Player("ytPlayer", {
        height: "500",
        width: `${
          window.matchMedia("(max-width: 400px)").matches
        }?'70vw':'25vw'`,
        suggestedQuality: "small",
        playerVars: {
          controls: 0,
          disablekd: 1,
          modestbranding: 1,
          fs: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };
  });
};
export default mySaga;
