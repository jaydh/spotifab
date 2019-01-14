import { listenForToken } from "./actions/tokenActions";
import { firebaseConf } from "./apiKeys";
import { store } from "./index";

const firebase = (window as any).firebase;
export const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const auth = firebase.auth();

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: "SIGN_IN", user });
    store.dispatch(listenForToken());
  } else {
    store.dispatch({ type: "RESET" });
    auth.signInAnonymously();
  }
});

export const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
firebase.auth().useDeviceLanguage();
