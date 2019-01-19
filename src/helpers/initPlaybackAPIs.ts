import { store } from '../index';
import { updatePlayer, nextSong } from '../actions/queueActions';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    ytPlayer: any;
    YT: any;
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
    player: any;
  }
}

declare var YT: any;
declare var Spotify: any;

export const initYoutube = () => {
  const { youtubeReady } = store.getState().player;
  if (!youtubeReady) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);
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
    const onPlayerReady = (event: any) => {
      window.ytPlayer.setVolume(store.getState().player.volume);
      const current = store.getState().queue.queue[
        store.getState().queue.position
      ];
      if (current && current.youtube) {
        window.ytPlayer.cueVideoById(current.track.id);
      }
      store.dispatch({ type: 'YOUTUBE_READY' });
    };

    const onPlayerStateChange = (event: any) => {
      store.dispatch(updatePlayer(event.data));
    };
  }
};

export const initSpotify = () => {
  const { spotifyReady } = store.getState().player;
  if (!spotifyReady) {
    const tag = document.createElement('script');
    tag.src = 'https://sdk.scdn.co/spotify-player.js';
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'bard',
        getOAuthToken: (cb: any) => {
          const token = store.getState().token.token;
          cb(token);
        }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }: any) => {
        console.error(message);
      });
      player.addListener('authentication_error', ({ message }: any) => {
        console.error(message);
      });
      player.addListener('account_error', ({ message }: any) => {
        console.error(message);
      });
      player.addListener('playback_error', ({ message }: any) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener('player_state_changed', (state: any) => {
        store.dispatch(updatePlayer(state));
      });

      // Ready
      player.addListener('ready', ({ device_id }: any) => {
        window.player = player;
        player.setVolume(store.getState().player.volume / 100);
        store.dispatch({ type: 'SPOTIFY_READY' });
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    };
  }
};
