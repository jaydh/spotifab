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
import App from './App';
import reducers from './reducers';
import { unregister } from './registerServiceWorker';

declare module 'redux' {
  export type GenericStoreEnhancer = any;
}

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
