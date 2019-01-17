import { store } from '../index';
import { updatePlayer, nextSong } from '../actions/queueActions';

export const initYoutube = () => {
  const { enabledServices } = store.getState().userReducer;
  const { youtubeReady } = store.getState().player;
  const { youtube } = enabledServices.toJS();
  if (youtube && !youtubeReady) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => {
      window.ytPlayer = new YT.Player('ytPlayer', {
        height: '500',
        width: `${
          window.matchMedia('(max-width: 400px)').matches
        }?'70vw':'25vw'`,
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
      window.ytPlayer.setVolume(store.getState().player.volume);
      const current = store
        .getState()
        .queue.queue.get(store.getState().queue.position);
      if (current && current.youtube) {
        window.ytPlayer.cueVideoById(current.track.id);
      }
      store.dispatch({ type: 'YOUTUBE_READY' });
    }

    function onPlayerStateChange(event) {
      store.dispatch(updatePlayer(event.data));
    }
  }
};

export const initSpotify = () => {
  const { enabledServices } = store.getState().userReducer;
  const { spotifyReady } = store.getState().player;
  const { spotify } = enabledServices.toJS();
  if (spotify && !spotifyReady) {
    const tag = document.createElement('script');
    tag.src = 'https://sdk.scdn.co/spotify-player.js';
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'bard',
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
      player.addListener('player_state_changed', state => {
        store.dispatch(updatePlayer(state));
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        window.player = player;
        player.setVolume(store.getState().player.volume / 100);
        store.dispatch({ type: 'SPOTIFY_READY' });
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    };
  }
};
