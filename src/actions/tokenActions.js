import { database, app } from '../firebase';
import { initSpotify } from '../helpers/initPlaybackAPIs';
import runSpotifyScript from '../lib/spotifySDK';
import { addMinutes, isBefore, parse } from 'date-fns';

export const setAuthCode = authCode => {
  return (dispatch, getState) => {
    const ref = database
      .collection('tokens')
      .doc(getState().userReducer.firebaseUser.uid);
    return ref.get().then((doc: any) => {
      dispatch({
        type: 'REFETCH_TOKEN'
      });

      return doc.auth_code !== authCode
        ? ref.set(
            { auth_code: authCode, host: window.location.host },
            { merge: true }
          )
        : Promise.resolve();
    });
  };
};

export const listenForToken = () => {
  return (dispatch, getState) => {
    initSpotify();
    database
      .collection('tokens')
      .doc(getState().userReducer.firebaseUser.uid)
      .onSnapshot(async doc => {
        if (doc.exists) {
          const { access_token, time } = await doc.data();
          dispatch({
            token: access_token,
            time,
            type: 'SET_TOKEN'
          });
          if (
            access_token &&
            !isBefore(new Date(), addMinutes(parse(time), 30))
          ) {
            dispatch(requestTokenRefresh());
            if (!getState().player.spotifyReady) {
              runSpotifyScript();
            }
          }
        }
      });
    setInterval(() => dispatch(requestTokenRefresh()), 900000);
  };
};

export const requestTokenRefresh = () => {
  return async (dispatch, getState) => {
    await database
      .collection('tokens')
      .doc(getState().userReducer.firebaseUser.uid)
      .set({ refetch: true }, { merge: true });
    dispatch({
      type: 'REFETCH_TOKEN'
    });
  };
};
