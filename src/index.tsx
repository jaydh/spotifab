import { addMinutes, isBefore, parse } from 'date-fns';
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
import { nextSong, prevSong, togglePlay } from './actions/songActions';
import { toggleMute } from './actions/soundActions';
import { listenForToken, requestTokenRefresh } from './actions/tokenActions';
import { firebaseConf } from './apiKeys';
import App from './App';
import reducers from './reducers';

declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

export const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const ui = new firebaseui.auth.AuthUI(app.auth());

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
(window as any).nextTrack = () => store.dispatch<any>(nextSong());
(window as any).previousTrack = () => store.dispatch<any>(prevSong());
(window as any).togglePlay = () => store.dispatch<any>(togglePlay());
(window as any).volumeMute = () => store.dispatch<any>(toggleMute());

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
    store.dispatch<any>(listenForToken());
    const state = store.getState() as any;
    const { token, time } = state.token;
    if (token && !isBefore(new Date(), addMinutes(parse(time), 30))) {
      store.dispatch<any>(requestTokenRefresh());
    }
  } else {
    store.dispatch({ type: 'SIGN_OUT' });
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
