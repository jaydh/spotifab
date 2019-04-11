import hash from "string-hash";
import { youtubeAPI } from "../../src/apiKeys";

export const clearPlaylistName = () => ({ type: "CLEAR_PLAYLIST_NAME" });

export const addUnifiedPlaylist = name => {
  const database = window.firebase.firestore();

  return async (dispatch, getState) => {
    const tracks = getState().queue.queue;
    const batch = database.batch();
    const id = hash(name).toString();
    dispatch({
      type: "ADD_UNIFIED_PLAYLIST",
      name,
      id,
      owner: { id: getState().userReducer.user.uid },
      tracks
    });

    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("playlists")
      .doc(id);

    batch.set(ref, {
      name,
      id,
      owner: { id: getState().userReducer.user.uid }
    });
    tracks.forEach(t => {
      batch.set(ref.collection("tracks").doc(t.track.id), t);
    });
    return batch.commit();
  };
};

export const convertPlaylistToUnified = playlistId => {
  return async (dispatch, getState) => {
    const name = getState().playlistReducer.playlistMenu.find(
      t => t.id === playlistId
    ).name;
    let tracks = getState().songsReducer.playlistSongs;
    tracks = await Promise.all(
      tracks.map(async t => {
        if (t.is_local) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&q=${encodeURIComponent(
              (t.track.name ? t.track.name : "") +
                " " +
                (t.track.artists.name ? t.track.artists.name : "") +
                " " +
                (t.track.album.name ? t.track.album.name : "")
            )}&part=snippet&maxResults=1&type=video`
          );
          const json = await res.json();
          const item = json.items[0];
          const track = {
            id: item.id.videoId,
            name: item.snippet.title
          };
          return {
            added_at: new Date().getTime(),
            youtube: true,
            track
          };
        }
        return t;
      })
    );
    const database = window.firebase.firestore();
    const batch = database.batch();
    const id = hash(name).toString();
    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("playlists")
      .doc(id);

    batch.set(ref, {
      name,
      id,
      owner: { id: getState().userReducer.user.uid }
    });
    tracks.forEach(t => {
      console.log(t);
      batch.set(ref.collection("tracks").doc(t.track.id), t);
    });
    return batch.commit().then(() =>
      dispatch({
        type: "ADD_UNIFIED_PLAYLIST",
        name,
        id,
        owner: { id: getState().userReducer.user.uid },
        tracks
      })
    );
  };
};

export const fetchPlaylistMenuPending = () => {
  return {
    type: "FETCH_PLAYLIST_MENU_PENDING"
  };
};

export const fetchPlaylistMenuSuccess = playlists => {
  return {
    playlists,
    type: "FETCH_PLAYLIST_MENU_SUCCESS"
  };
};

export const fetchPlaylistMenuError = () => {
  return {
    type: "FETCH_PLAYLIST_MENU_ERROR"
  };
};

export const addPlaylistItem = playlist => {
  return {
    playlist,
    type: "ADD_PLAYLIST_ITEM"
  };
};

export const fetchPlaylistsMenu = () => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistMenuPending());

    const res = await (await fetch(`https://api.spotify.com/v1/me/playlists`, {
      headers: new Headers({
        Authorization: "Bearer " + accessToken
      })
    })).json();
    dispatch(
      fetchPlaylistMenuSuccess(
        res.items &&
          res.items.map(t => {
            return { ...t, spotify: true };
          })
      )
    );
  };
};

export const fetchUnifiedPlaylistMenu = () => {
  return (dispatch, getState) => {
    const { userReducer } = getState();
    if (window.firebase.firestore && userReducer.signedIn) {
      const database = window.firebase.firestore();
      const ref = database
        .collection("userData")
        .doc(userReducer.user.uid)
        .collection("playlists");
      return ref.get().then(query => {
        const playlists = [];
        query.forEach(doc =>
          playlists.push({
            name: doc.data().name,
            id: doc.data().id,
            owner: doc.data().owner,
            unified: true
          })
        );
        dispatch({ type: "FETCH_UNIFIED_PLAYLIST_MENU", playlists });
      });
    } else {
      dispatch({ type: "FETCH_UNIFIED_PLAYLIST_FAILED" });
    }
  };
};

export const deleteUnifiedPlaylist = id => {
  const database = window.firebase.firestore();

  return async (dispatch, getState) => {
    dispatch({ type: "DELETE_UNIFIED_PLAYLIST", id });
    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("playlists")
      .doc(id);
    return ref.delete();
  };
};

export const createNewPlaylist = (name, description) => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    const userId = getState().userReducer.user.id;
    const trackURIs = getState().queue.queue.map(t => t.track.uri);
    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        public: true
      }),
      headers: new Headers({
        Authorization: "Bearer " + accessToken
      })
    });
    const playlists = (await (await fetch(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    )).json()).items;
    const newPlaylist = playlists.filter(t => t.name === name);
    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${
        newPlaylist.get(0).id
      }/tracks`,
      {
        method: "POST",
        body: JSON.stringify({
          uris: trackURIs
        }),
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );
    dispatch(fetchPlaylistsMenu());
  };
};

export const unfollowPlaylist = id => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    const userId = getState().userReducer.user.id;
    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${id}/followers`,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );
    dispatch(fetchPlaylistsMenu());
  };
};
