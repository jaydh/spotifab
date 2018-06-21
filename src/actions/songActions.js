import { List } from "immutable";
import { youtubeAPI } from "../../src/apiKeys";

export const addYoutubeSong = id => {
  return async dispatch => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${youtubeAPI}&part=snippet&id=${id}`
    );
    const json = await res.json();
    dispatch({
      type: "ADD_YOUTUBE_TRACK",
      id: json.items["0"].id,
      name: json.items["0"].snippet.title
    });
  };
};

export const fetchSongsPending = () => {
  return {
    type: "FETCH_SONGS_PENDING"
  };
};

export const fetchSongsSuccess = songs => {
  return {
    songs,
    type: "FETCH_SONGS_SUCCESS"
  };
};

export const fetchSongsError = () => {
  return {
    type: "FETCH_SONGS_ERROR"
  };
};

export const fetchSongs = () => {
  return async (dispatch, getState) => {
    const accessToken = getState().player.token;
    const fetches = [];
    dispatch(fetchSongsPending());
    for (let i = 0; i < 2; i++) {
      const request = new Request(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${i * 50}`,
        {
          headers: new Headers({
            Authorization: "Bearer " + accessToken
          })
        }
      );
      fetches.push(request);
    }
    const data = await Promise.all(fetches.map(t => fetch(t)));
    const json = await Promise.all(data.map(t => t.json()));
    const items = List(json.map(re => re.items).reduce((a, b) => [...a, ...b]));
    dispatch(fetchSongsSuccess(items));
  };
};

export const searchSongsPending = () => {
  return {
    type: "SEARCH_SONGS_PENDING"
  };
};

export const searchSongsSuccess = songs => {
  return {
    songs,
    type: "SEARCH_SONGS_SUCCESS"
  };
};

export const searchSongsError = () => {
  return {
    type: "SEARCH_SONGS_ERROR"
  };
};

export const searchSongs = (searchTerm, accessToken) => {
  return dispatch => {
    const request = new Request(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
      {
        headers: new Headers({
          Accept: "application/json",
          Authorization: "Bearer " + accessToken
        })
      }
    );

    dispatch(searchSongsPending());

    fetch(request)
      .then(res => {
        if (res.statusText === "Unauthorized") {
          window.location.href = "./";
        }
        return res.json();
      })
      .then(res => {
        res.items = res.tracks.items.map(item => {
          return {
            track: item
          };
        });
        dispatch(searchSongsSuccess(res.items));
      })
      .catch(err => {
        dispatch(fetchSongsError(err));
      });
  };
};

export const fetchRecentlyPlayedPending = () => {
  return {
    type: "FETCH_RECENTLY_PLAYED_PENDING"
  };
};

export const fetchRecentlyPlayedSuccess = songs => {
  return {
    songs,
    type: "FETCH_RECENTLY_PLAYED_SUCCESS"
  };
};

export const fetchRecentlyPlayedError = () => {
  return {
    type: "FETCH_RECENTLY_PLAYED_ERROR"
  };
};

export const fetchRecentlyPlayed = () => {
  return (dispatch, getState) => {
    const accessToken = getState().player.token;
    const request = new Request(
      `https://api.spotify.com/v1/me/player/recently-played`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );

    dispatch(fetchRecentlyPlayedPending());

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch(fetchRecentlyPlayedSuccess(List(res.items)));
      });
  };
};

export const play = () => {
  return async (dispatch, getState) => {
    const token = getState().player.token;
    const songs = getState().player.activeQueue;
    const youtube = songs.first().youtube;
    const apiPlay = ({
      spotify_uri,
      playerInstance: {
        _options: { id }
      }
    }) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ uris: spotify_uri }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    };
    if (youtube) {
      window.player.pause();
      window.ytPlayer.loadVideoById(songs.first().track.id);
    } else {
      apiPlay({
        playerInstance: window.player,
        spotify_uri: songs
          .filter(t => !t.youtube)
          .map(t => t.track.uri)
          .toJS()
      });
    }

    dispatch({
      type: "PLAY"
    });
  };
};

export const togglePlay = () => {
  return (dispatch, getState) => {
    if (getState().player.currentTrack.youtube) {
      window.ytPlayer.getPlayerState() === 1
        ? window.ytPlayer.pauseVideo()
        : window.ytPlayer.playVideo();
    } else {
      window.player.togglePlay();
    }
    dispatch({
      type: "TOGGLE_PLAY"
    });
  };
};
export const nextSong = () => {
  return (dispatch, getState) => {
    dispatch({
      type: "NEXT_SONG"
    });

    const next = getState().player.currentTrack;
    const token = getState().player.token;
    const spotifyPaused = getState().player.player.paused;
    const apiPlay = ({
      spotify_uri,
      playerInstance: {
        _options: { id }
      }
    }) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ uris: spotify_uri }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    };

    if (next.uri) {
      window.ytPlayer.pauseVideo();
      //If switching from youtube to spotify, use last played track
      if (spotifyPaused) {
        window.player.seek(0);
        window.player.resume();
      } else {
        apiPlay({
          playerInstance: window.player,
          spotify_uri: [next.uri]
        });
      }
    } else {
      window.ytPlayer.loadVideoById(next.id);
      window.player.pause();
    }
  };
};
export const prevSong = () => {
  return (dispatch, getState) => {
    dispatch({
      type: "PREV_SONG"
    });
    const next = getState().player.currentTrack;
    const spotifyPaused = getState().player.player.paused;
    const token = getState().player.token;
    const apiPlay = ({
      spotify_uri,
      playerInstance: {
        _options: { id }
      }
    }) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ uris: spotify_uri }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    };

    if (next.uri) {
      window.ytPlayer.pauseVideo();
      //If switching from youtube to spotify, use last played track
      if (spotifyPaused) {
        window.player.seek(0);
        window.player.resume();
      } else {
        apiPlay({
          playerInstance: window.player,
          spotify_uri: [next.uri]
        });
      }
    } else {
      window.ytPlayer.cueVideoById(next.id);
      window.player.pause().then(() => {
        window.ytPlayer.playVideo();
      });
    }
  };
};

export const updateViewType = view => {
  return {
    type: "UPDATE_VIEW_TYPE",
    view
  };
};
