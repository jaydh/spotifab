import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import { nextSong, prevSong, togglePlay } from './actions/queueActions';
import { toggleMute, updateVolume } from './actions/soundActions';
import { listenForToken } from './actions/tokenActions';
import { firebaseConf } from './apiKeys';
import App from './App';
import reducers from './reducers';
import { unregister } from './registerServiceWorker';

declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

export const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const auth = firebase.auth();
export const ui = new firebaseui.auth.AuthUI(app.auth());

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
(window as any).nextTrack = () => store.dispatch(nextSong());
(window as any).previousTrack = () => store.dispatch(prevSong());
(window as any).togglePlay = () => store.dispatch(togglePlay());
(window as any).toggleMute = () => store.dispatch(toggleMute());
(window as any).volumeDown = () =>
  store.dispatch(updateVolume(store.getState().player.volume - 0.01));
(window as any).volumeUp = () =>
  store.dispatch(updateVolume(store.getState().player.volume + 0.01));
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
    store.dispatch(listenForToken());
  } else {
    store.dispatch({ type: 'RESET' });
  }
});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

unregister();
