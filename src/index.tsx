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
const config = {
  apiKey: 'AIzaSyBiqbvG93Vd0tqHkNGZNg6VBHUC4onS3jE',
  authDomain: 'spotifab-3379e.firebaseapp.com',
  databaseURL: 'https://spotifab-3379e.firebaseio.com',
  projectId: 'spotifab-3379e',
  storageBucket: '',
  messagingSenderId: '1045511818191'
};
const app = firebase.initializeApp(config);
console.log(app);
declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
(window as any).nextTrack = () => store.dispatch<any>(nextSong());
(window as any).previousTrack = () => store.dispatch<any>(prevSong());
(window as any).togglePlay = () => store.dispatch<any>(togglePlay());
(window as any).volumeMute = () => store.dispatch<any>(toggleMute());

const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
