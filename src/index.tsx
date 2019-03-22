import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import App from './App';
import reducers from './reducers';
import register from './registerServiceWorker';
import createSagaMiddleware from 'redux-saga';
import playSong from './sagas/playSong';
import initSpotify from './sagas/initSpotify';
import initYoutube from './sagas/initYoutube';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    ytPlayer: any;
    YT: any;
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
    player: any;
  }
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
);
sagaMiddleware.run(playSong);
sagaMiddleware.run(initSpotify);
sagaMiddleware.run(initYoutube);

export const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

/*window.addEventListener("beforeinstallprompt", (e: any) => {
  // Stash the event so it can be triggered later.
  const deferredPrompt = e;
  console.log("d,", deferredPrompt);
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
  });
  });*/
register();
