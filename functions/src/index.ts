import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const config = {
  apiKey: 'AIzaSyBiqbvG93Vd0tqHkNGZNg6VBHUC4onS3jE',
  authDomain: 'spotifab-3379e.firebaseapp.com',
  databaseURL: 'https://spotifab-3379e.firebaseio.com',
  projectId: 'spotifab-3379e',
  storageBucket: '',
  messagingSenderId: '1045511818191'
};
admin.initializeApp(config);

export const getToken = functions.firestore
  .document('tokens/{uid}')
  .onWrite(async (change, context) => {
    const redirect_uri = 'https://spotifab-3379e.firebaseapp.com/callback';
    const oldCode = change.before.data().auth_code;
    const newCode = change.after.data().auth_code;
    const { id, secret } = await (await admin
      .firestore()
      .collection('client')
      .doc('apiKey')
      .get()).data();
    const json = await (await fetch('https://accounts.spotify.com/api/token', {
      body: `grant_type=authorization_code&client_id=${id}&client_secret=${secret}&code=${newCode}&redirect_uri=${redirect_uri}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })).json();

    return oldCode !== newCode
      ? change.after.ref.set(
          {
            access_token: json.access_token
              ? json.access_token
              : change.after.data().access_token,
            refresh_token: json.refresh_token
              ? json.refresh_token
              : change.after.data().refresh_token
          },
          { merge: true }
        )
      : Promise.resolve();
  });

export const refreshToken = functions.firestore
  .document('tokens/{uid}')
  .onWrite(async (change, context) => {
    const oldFetch = change.before.data().refetch;
    const newFetch = change.after.data().refetch;
    const refresh_token = change.after.data().refresh_token;
    const { id, secret } = await (await admin
      .firestore()
      .collection('client')
      .doc('apiKey')
      .get()).data();
    const json = await (await fetch('https://accounts.spotify.com/api/token', {
      body: `grant_type=refresh_token&client_id=${id}&client_secret=${secret}&refresh_token=${refresh_token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })).json();

    return newFetch && newFetch !== oldFetch
      ? change.after.ref.set(
          {
            access_token: json.access_token,
            refresh_token: json.refresh_token
              ? json.refresh_token
              : refresh_token,
            refetch: false
          },
          { merge: true }
        )
      : Promise.resolve();
  });
