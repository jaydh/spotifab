import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import fetch from "node-fetch";

const config = {
  apiKey: "AIzaSyBiqbvG93Vd0tqHkNGZNg6VBHUC4onS3jE",
  authDomain: "spotifab-3379e.firebaseapp.com",
  databaseURL: "https://spotifab-3379e.firebaseio.com",
  projectId: "spotifab-3379e",
  storageBucket: "",
  messagingSenderId: "1045511818191"
};
admin.initializeApp(config);

export const getToken = functions.firestore
  .document("tokens/{uid}")
  .onCreate(async (change, context) => {
    const code = change.data().auth_code;
    const host = change.data().host;
    const redirect_uri = host;
    const { id, secret } = await (await admin
      .firestore()
      .collection("client")
      .doc("apiKey")
      .get()).data();
    const json = await (await fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=authorization_code&client_id=${id}&client_secret=${secret}&code=${code}&redirect_uri=${redirect_uri}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })).json();
    console.log(json, redirect_uri);
    return json.access_token
      ? change.ref.set({
          access_token: json.access_token,
          refresh_token: json.refresh_token,
          auth_code: code,
          time: Date.now()
        })
      : change.ref.delete();
    return Promise.resolve();
  });

export const refreshToken = functions.firestore
  .document("tokens/{uid}")
  .onWrite(async (change, context) => {
    const oldFetch = change.before.data() ? change.before.data().refetch : null;
    const newFetch = change.after.data() ? change.after.data().refetch : null;
    if (newFetch && newFetch !== oldFetch) {
      const refresh_token = change.after.data().refresh_token;
      const { id, secret } = await (await admin
        .firestore()
        .collection("client")
        .doc("apiKey")
        .get()).data();
      const json = await (await fetch(
        "https://accounts.spotify.com/api/token",
        {
          body: `grant_type=refresh_token&client_id=${id}&client_secret=${secret}&refresh_token=${refresh_token}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST"
        }
      )).json();

      return json.access_token
        ? change.after.ref.set(
            {
              access_token: json.access_token
                ? json.access_token
                : change.after.data().access_token,
              refetch: false,
              time: Date.now()
            },
            { merge: true }
          )
        : change.after.ref.delete();
    }
    return Promise.resolve();
  });
