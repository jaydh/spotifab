import firebase from "../firebase";
import { Dispatch } from "redux";

export const loadFirebase = () => {
  return (dispatch: any) => {
    new Promise((resolve, reject) => {
      const main = document.createElement("script");
      main.src = "https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js";
      main.async = true;
      main.defer = true;
      main.onload = () =>
        loadFirebaseAddons().then(() => {
          dispatch({ type: "FIREBASE_LOADED" });
          resolve();
        });
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag &&
        firstScriptTag.parentNode &&
        firstScriptTag.parentNode.insertBefore(main, firstScriptTag);
    });
  };
};

const loadFirebaseAddons = () => {
  const links = [
    "https://www.gstatic.com/firebasejs/5.7.2/firebase-auth.js",
    "https://www.gstatic.com/firebasejs/5.7.2/firebase-firestore.js"
  ];
  const promises = links.map((t: string) => {
    return new Promise((resolve, reject) => {
      const firstScriptTag = document.getElementsByTagName("script")[0];
      const script = document.createElement("script");
      script.src = t;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      firstScriptTag &&
        firstScriptTag.parentNode &&
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    });
  });
  return Promise.all(promises).then(() => {
    firebase();
  });
};
