import { database } from '../index';
import initSpotify from '../initSpotifySDK';

export const setAuthCode = authCode => {
  return dispatch => {
    const ref = database.collection('tokens').doc('jay');
    return ref.get().then((doc: any) => {
      if (doc.auth_code !== authCode) {
        ref.set({ auth_code: authCode }, { merge: true });
      }
    });
  };
};

export const listenForToken = () => {
  return dispatch =>
    database
      .collection('tokens')
      .doc('jay')
      .onSnapshot(async doc => {
        const { access_token } = await doc.data();
        dispatch({
          token: access_token,
          type: 'SET_TOKEN'
        });
      });
};

export const requestTokenRefresh = () => {
  return async dispatch => {
    await database
      .collection('tokens')
      .doc('jay')
      .set({ refetch: true }, { merge: true });
    dispatch({
      type: 'REFETCH_TOKEN'
    });
  };
};
