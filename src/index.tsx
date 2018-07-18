import { firebaseConf } from './apiKeys';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import { nextSong, prevSong, togglePlay } from './actions/songActions';
import { toggleMute } from './actions/soundActions';
import App from './App';
import reducers from './reducers';
declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

export const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
const persistor = persistStore(store);

(window as any).nextTrack = () => store.dispatch<any>(nextSong());
(window as any).previousTrack = () => store.dispatch<any>(prevSong());
(window as any).togglePlay = () => store.dispatch<any>(togglePlay());
(window as any).volumeMute = () => store.dispatch<any>(toggleMute());
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
  } else {
    store.dispatch({ type: 'SIGN_OUT' });
  }
});
const ui = new firebaseui.auth.AuthUI(app.auth());
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      return false;
    },
    uiShown: () => {
      document.getElementById('loader')!.style.display = 'none';
    },

    signInSuccessUrl: 'https://spotifab-3379e.firebaseapp.com/'
  },
  signInFlow: 'redirect',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};
ui.start('#firebaseui-auth-container', uiConfig);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
