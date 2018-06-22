import { store } from './index';
import { nextSong } from './actions/songActions';
const initYoutube = () => {
  const tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  window.onYouTubeIframeAPIReady = () => {
    window.ytPlayer = new YT.Player('ytPlayer', {
      height: '100',
      width: '500',
      suggestedQuality: 'small',
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    window.ytPlayer.setPlaybackQuality('small');
    window.ytPlayer.setVolume(store.getState().player.volume * 100);
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data === 0) {
      store.dispatch(nextSong());
    }
    store.dispatch({
      type: 'UPDATE_YOUTUBE_PLAYER_STATE',
      state: event.data
    });
  }
};

const initSpotify = () => {
  const tag = document.createElement('script');

  tag.src = 'https://sdk.scdn.co/spotify-player.js';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  const token = store.getState().player.token;
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'player',
      getOAuthToken: cb => {
        cb(token);
      }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    let nexted = false;
    player.addListener('player_state_changed', state => {
      store.dispatch({
        type: 'UPDATE_SPOTIFY_PLAYER_STATE',
        state
      });
      console.log(nexted);
      if (!nexted && state.paused && state.position === 0) {
        nexted = true;
        store.dispatch(nextSong());
      }
      if (state.position !== 0) {
        nexted = false;
      }
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      window.player = player;
      player.setVolume(store.getState().player.volume);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  };
};
export default () => {
  initYoutube();
  initSpotify();
};
