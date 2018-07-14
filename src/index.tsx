import { firebaseConf } from './apiKeys';

import * as firebase from 'firebase';
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

const app = firebase.initializeApp(firebaseConf);
export const database = app.firestore();
export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
const persistor = persistStore(store);

(window as any).nextTrack = () => store.dispatch<any>(nextSong());
(window as any).previousTrack = () => store.dispatch<any>(prevSong());
(window as any).togglePlay = () => store.dispatch<any>(togglePlay());
(window as any).volumeMute = () => store.dispatch<any>(toggleMute());

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
