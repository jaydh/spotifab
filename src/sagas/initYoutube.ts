import { select, debounce, call, put, takeLatest } from "redux-saga/effects";
declare var YT: any;

function* initYoutube(action: any) {
  try {
    const { player, token } = yield select();
    yield call(handleInit, { player, token });
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

  const loadSDK = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.defer = true;
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag &&
      firstScriptTag.parentNode &&
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = () => resolve();
  });

  return youtubeReady
    ? Promise.resolve()
    : loadSDK.then(() => setupYoutube(player, token));
};

const setupYoutube = (player: any, token: string) => {
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
