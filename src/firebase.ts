import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import { listenForToken } from './actions/tokenActions';
import { firebaseConf } from './apiKeys';
import { store } from './index';

export const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const auth = firebase.auth();
export const ui = new firebaseui.auth.AuthUI(app.auth());

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
    store.dispatch(listenForToken());
  } else {
    store.dispatch({ type: 'RESET' });
  }
});
