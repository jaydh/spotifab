import { store } from '../index';
import { nextSong } from '../actions/queueActions';
import runYoutubeScript from '../lib/youtubeAPI';
import runSpotifyScript from '../lib/spotifySDK';

export const initYoutube = () => {
  /*const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/
  window.onYouTubeIframeAPIReady = () => {
    window.ytPlayer = new YT.Player('ytPlayer', {
      height: '500',
      width: '800',
      suggestedQuality: 'small',
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

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    window.ytPlayer.setVolume(store.getState().player.volume * 100);
    const current = store
      .getState()
      .queue.queue.get(store.getState().queue.position);
    if (current && current.youtube) {
      window.ytPlayer.cueVideoById(current.track.id);
      window.ytPlayer.pauseVideo();
    }
    store.dispatch({ type: 'YOUTUBE_READY' });
  }

  function onPlayerStateChange(event) {
    if (event.data === 0) {
      store.dispatch(nextSong());
    }
    store.dispatch({
      type: 'UPDATE_YOUTUBE_PLAYER_STATE',
      state: event.data
    });
  }
  runYoutubeScript();
};

export const initSpotify = () => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'player',
      getOAuthToken: cb => {
        const token = store.getState().token.token;
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
      if (state) {
        if (!nexted && state.paused && state.position === 0) {
          nexted = true;
          store.dispatch(nextSong());
        }
        if (state.position !== 0) {
          nexted = false;
        }
      }
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      window.player = player;
      player.setVolume(store.getState().player.volume);
      store.dispatch({ type: 'SPOTIFY_READY' });
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  };
  runSpotifyScript();
};
export default () => {
  initSpotify();
  initYoutube();
};
