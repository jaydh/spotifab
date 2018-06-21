import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk';
import App from './App';
import reducers from './reducers';

const config = {
  apiKey: 'AIzaSyBiqbvG93Vd0tqHkNGZNg6VBHUC4onS3jE',
  authDomain: 'spotifab-3379e.firebaseapp.com',
  databaseURL: 'https://spotifab-3379e.firebaseio.com',
  projectId: 'spotifab-3379e',
  storageBucket: '',
  messagingSenderId: '1045511818191'
}
const app = firebase.initializeApp(config);
console.log(app);
declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

const persistConfig = {
  key: 'root',
  transforms: [immutableTransform()],
  storage,
  whitelist: ['player', 'songsReducer']
};
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
const persistor = persistStore(store);
persistor.purge();
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
