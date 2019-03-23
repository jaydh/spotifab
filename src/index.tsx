import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import thunk from "redux-thunk";
import App from "./App";
import reducers from "./reducers";
import { unregister } from "./registerServiceWorker";
import createSagaMiddleware from "redux-saga";
import root from "./sagas/root";
import { loadFirebase } from "./actions/firebase";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    ytPlayer: any;
    YT: any;
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
    player: any;
    firebase: any;
  }
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
);
sagaMiddleware.run(root);

export const persistor = persistStore(store);
loadFirebase().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );
});

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
unregister();
