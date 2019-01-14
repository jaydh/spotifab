"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const node_fetch_1 = require("node-fetch");
const config = {
    apiKey: "AIzaSyBiqbvG93Vd0tqHkNGZNg6VBHUC4onS3jE",
    authDomain: "spotifab-3379e.firebaseapp.com",
    databaseURL: "https://spotifab-3379e.firebaseio.com",
    projectId: "spotifab-3379e",
    storageBucket: "",
    messagingSenderId: "1045511818191"
};
admin.initializeApp(config);
exports.getToken = functions.firestore
    .document("tokens/{uid}")
    .onCreate((change, context) => __awaiter(this, void 0, void 0, function* () {
    const code = change.data().auth_code;
    const host = change.data().host;
    const redirect_uri = host;
    const { id, secret } = yield (yield admin
        .firestore()
        .collection("client")
        .doc("apiKey")
        .get()).data();
    const json = yield (yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
        body: `grant_type=authorization_code&client_id=${id}&client_secret=${secret}&code=${code}&redirect_uri=${redirect_uri}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })).json();
    console.log(json, redirect_uri);
    return json.access_token
        ? change.ref.set({
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            auth_code: code,
            time: Date.now()
        })
        : change.ref.delete();
    return Promise.resolve();
}));
exports.refreshToken = functions.firestore
    .document("tokens/{uid}")
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    const oldFetch = change.before.data() ? change.before.data().refetch : null;
    const newFetch = change.after.data() ? change.after.data().refetch : null;
    if (newFetch && newFetch !== oldFetch) {
        const refresh_token = change.after.data().refresh_token;
        const { id, secret } = yield (yield admin
            .firestore()
            .collection("client")
            .doc("apiKey")
            .get()).data();
        const json = yield (yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
            body: `grant_type=refresh_token&client_id=${id}&client_secret=${secret}&refresh_token=${refresh_token}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })).json();
        return json.access_token
            ? change.after.ref.set({
                access_token: json.access_token
                    ? json.access_token
                    : change.after.data().access_token,
                refetch: false,
                time: Date.now()
            }, { merge: true })
            : change.after.ref.delete();
    }
    return Promise.resolve();
}));
//# sourceMappingURL=index.js.map