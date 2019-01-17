import { initSpotify } from "../helpers/initPlaybackAPIs";
import { addMinutes, isBefore, parse } from "date-fns";

export const setAuthCode = authCode => {
  const database = window.firebase.firestore();

  return (dispatch, getState) => {
    database
      .collection("client")
      .doc("apiKey")
      .get()
      .then(doc => console.log(doc.data()));
    const ref = database
      .collection("tokens")
      .doc(getState().userReducer.firebaseUser.uid);
    dispatch({
      type: "REFETCH_TOKEN"
    });
    const isDev = window.location.host.startsWith("local");
    const callback = isDev ? "http://localhost:3000/" : "https://bard.live/";

    return ref
      .set({ auth_code: authCode, host: callback })
      .then(() => dispatch({ type: "SET_AUTH_TOKEN_SUCCESS" }));
  };
};

export const listenForToken = () => {
  const database = window.firebase.firestore();

  return (dispatch, getState) => {
    initSpotify();
    database
      .collection("tokens")
      .doc(getState().userReducer.firebaseUser.uid)
      .onSnapshot(async doc => {
        if (doc.exists) {
          const { access_token, time } = await doc.data();
          dispatch({
            token: access_token,
            time,
            type: "SET_TOKEN"
          });
          if (
            access_token &&
            !isBefore(new Date(), addMinutes(parse(time), 30))
          ) {
            dispatch(requestTokenRefresh());
            if (!getState().player.spotifyReady) {
              initSpotify();
            }
          }
        }
      });
    setInterval(() => dispatch(requestTokenRefresh()), 900000);
  };
};

export const requestTokenRefresh = () => {
  const database = window.firebase.firestore();

  return async (dispatch, getState) => {
    await database
      .collection("tokens")
      .doc(getState().userReducer.firebaseUser.uid)
      .set({ refetch: true }, { merge: true });
    dispatch({
      type: "REFETCH_TOKEN"
    });
  };
};
