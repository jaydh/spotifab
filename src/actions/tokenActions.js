import { addMinutes, isBefore, parse } from "date-fns";

export const setAuthCode = auth_code => {
  return (dispatch, getState) => {
    const database = window.firebase.firestore();
    database
      .collection("client")
      .doc("apiKey")
      .get();
    const ref = database
      .collection("tokens")
      .doc(getState().userReducer.user.uid);
    const isDev = window.location.host.startsWith("local");
    const host = isDev ? "http://localhost:3000/" : "https://bard.live/";
    return ref
      .set({ auth_code, host })
      .then(() => dispatch({ type: "SET_AUTH_TOKEN_SUCCESS" }));
  };
};

export const listenForToken = () => {
  const database = window.firebase.firestore();
  return (dispatch, getState) => {
    database
      .collection("tokens")
      .doc(getState().userReducer.user.uid)
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
      .doc(getState().userReducer.user.uid)
      .set({ refetch: true }, { merge: true });
    return dispatch({
      type: "REFETCH_TOKEN"
    });
  };
};
