import firebase from "../firebase";

export const loadFirebase = () => {
  return (dispatch: any) => {
    const main = document.createElement("script");
    main.src = "https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js";
    main.async = true;
    main.defer = true;
    main.onload = () => {
      const links = [
        "https://www.gstatic.com/firebasejs/5.7.2/firebase-auth.js",
        "https://www.gstatic.com/firebasejs/5.7.2/firebase-firestore.js"
      ];
      const promises = links.map((t: string) => {
        return new Promise((resolve: any, reject: any) => {
          const script = document.createElement("script");
          script.src = t;
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.body.appendChild(script);
        });
      });
      return Promise.all(promises)
        .then(() => {
          firebase();
        })
        .then(() => dispatch({ type: "FIREBASE_LOADED" }));
    };
    document.body.appendChild(main);
  };
};
