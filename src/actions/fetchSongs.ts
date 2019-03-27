import { Dispatch } from "redux";
import { parse } from "date-fns";

export const fetchPlaylistSongsPending = () => {
  return {
    type: "FETCH_PLAYLIST_SONGS_PENDING"
  };
};

export const fetchPlaylistSongsSuccess = (name: string, songs: any[]) => {
  return {
    name,
    songs,
    type: "FETCH_PLAYLIST_SONGS_SUCCESS"
  };
};

export const fetchPlaylistSongsError = () => {
  return {
    type: "FETCH_PLAYLIST_SONGS_ERROR"
  };
};

export const fetchPlaylistSongs = (playlistId: string) => {
  return async (dispatch: Dispatch, getState: any) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );
    const json = await res.json();
    dispatch(
      fetchPlaylistSongsSuccess(
        "d",
        json.items.map((t: any) => {
          return { ...t, spotify: true };
        })
      )
    );
  };
};

export const fetchUnifiedSongs = (playlistId: string) => {
  const database = window.firebase.firestore();
  return async (dispatch: Dispatch, getState: any) => {
    dispatch(fetchPlaylistSongsPending());
    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("playlists")
      .doc(playlistId)
      .collection("tracks");
    return ref.get().then((query: any) => {
      const tracks: any[] = [];
      query.forEach((doc: any) => tracks.push(doc.data()));
      dispatch(fetchPlaylistSongsSuccess("uni", tracks));
    });
  };
};

export const fetchRecent = () => {
  return async (dispatch: Dispatch, getState: any) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );
    const json = await res.json();
    dispatch(
      fetchPlaylistSongsSuccess(
        "Recent",
        json.items.map((t: any) => {
          return { ...t, spotify: true };
        })
      )
    );
  };
};

export const fetchNew = () => {
  return async (dispatch: Dispatch, getState: any) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await (await fetch(
      `https://api.spotify.com/v1/browse/new-releases?country=US&limit=20`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    )).json();
    const trackArrays: any[] = await Promise.all(
      res.albums.items.map(async (t: any) => {
        const tracks = await (await fetch(
          `https://api.spotify.com/v1/albums/${t.id}/tracks`,
          {
            headers: new Headers({
              Authorization: "Bearer " + accessToken
            })
          }
        )).json();

        return tracks.items.map((track: any) => {
          return {
            added_at: parse(t.release_date),
            spotify: true,
            track: { ...track, album: t }
          };
        });
      })
    );

    dispatch(
      fetchPlaylistSongsSuccess("New", [].concat.apply([], trackArrays))
    );
  };
};

export const fetchAlbum = (id: string) => {
  return async (dispatch: Dispatch, getState: any) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());

    const album = await (await fetch(
      `https://api.spotify.com/v1/albums/${id}`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    )).json();
    const albumTracks = album.tracks.items.map((track: any) => {
      return {
        added_at: parse(album.release_date),
        spotify: true,
        track: { ...track, album }
      };
    });

    dispatch(fetchPlaylistSongsSuccess(album.name, albumTracks));
  };
};

export const fetchArtist = (id: string) => {
  return async (dispatch: Dispatch, getState: any) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());

    const artist = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: new Headers({
        Authorization: "Bearer " + accessToken
      })
    }).then(res => res.json());

    const artistAlbums = (await (await fetch(
      `https://api.spotify.com/v1/artists/${id}/albums`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    )).json()).items;
    const albums = await Promise.all(
      artistAlbums
        .map((album: any) => album.id)
        .map(async (id: string) =>
          fetch(`https://api.spotify.com/v1/albums/${id}`, {
            headers: new Headers({
              Authorization: "Bearer " + accessToken
            })
          }).then(res => res.json())
        )
    );

    const albumTracks = albums
      .map((album: any) =>
        album.tracks.items.map((track: any) => ({
          added_at: parse(album.release_date),
          spotify: true,
          track: { ...track, album }
        }))
      )
      .flat();
    dispatch(fetchPlaylistSongsSuccess(artist.name, albumTracks));
  };
};
