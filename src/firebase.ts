import { listenForToken } from "./actions/tokenActions";
import { firebaseConf } from "./apiKeys";
import { store } from "./index";

export default () => {
  const firebase = (window as any).firebase;
  firebase.initializeApp(firebaseConf);
  firebase.auth().onAuthStateChanged((user: any) => {
    if (user) {
      store.dispatch({ type: "SIGN_IN", user });
      store.dispatch(listenForToken());
    } else {
      store.dispatch({ type: "RESET" });
      firebase.auth().signInAnonymously();
    }
  });

  firebase.auth().useDeviceLanguage();
};
