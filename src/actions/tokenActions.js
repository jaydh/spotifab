import { database, app } from '../index';

export const setAuthCode = authCode => {
  return (dispatch, getState) => {
    console.log(getState());
    const ref = database
      .collection('tokens')
      .doc(getState().userReducer.firebaseUser.uid);
    return ref.get().then((doc: any) => {
      return doc.auth_code !== authCode
        ? ref.set({ auth_code: authCode }, { merge: true })
        : Promise.resolve();
    });
  };
};

export const listenForToken = () => {
  return (dispatch, getState) => {
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
