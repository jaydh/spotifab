"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var admin = require("firebase-admin");
var functions = require("firebase-functions");
var node_fetch_1 = require("node-fetch");
var config = {
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
    .onCreate(function (change, context) { return __awaiter(_this, void 0, void 0, function () {
    var code, host, redirect_uri, _a, id, secret, json;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                code = change.data().auth_code;
                host = change.data().host;
                redirect_uri = host;
                return [4 /*yield*/, admin
                        .firestore()
                        .collection("client")
                        .doc("apiKey")
                        .get()];
            case 1: return [4 /*yield*/, (_b.sent()).data()];
            case 2:
                _a = _b.sent(), id = _a.id, secret = _a.secret;
                return [4 /*yield*/, node_fetch_1["default"]("https://accounts.spotify.com/api/token", {
                        body: "grant_type=authorization_code&client_id=" + id + "&client_secret=" + secret + "&code=" + code + "&redirect_uri=" + redirect_uri,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST"
                    })];
            case 3: return [4 /*yield*/, (_b.sent()).json()];
            case 4:
                json = _b.sent();
                console.log(json, redirect_uri);
                return [2 /*return*/, json.access_token
                        ? change.ref.set({
                            access_token: json.access_token,
                            refresh_token: json.refresh_token,
                            auth_code: code,
                            time: Date.now()
                        })
                        : change.ref["delete"]()];
        }
    });
}); });
exports.refreshToken = functions.firestore
    .document("tokens/{uid}")
    .onWrite(function (change, context) { return __awaiter(_this, void 0, void 0, function () {
    var oldFetch, newFetch, refresh_token, _a, id, secret, json;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                oldFetch = change.before.data() ? change.before.data().refetch : null;
                newFetch = change.after.data() ? change.after.data().refetch : null;
                if (!(newFetch && newFetch !== oldFetch)) return [3 /*break*/, 5];
                refresh_token = change.after.data().refresh_token;
                return [4 /*yield*/, admin
                        .firestore()
                        .collection("client")
                        .doc("apiKey")
                        .get()];
            case 1: return [4 /*yield*/, (_b.sent()).data()];
            case 2:
                _a = _b.sent(), id = _a.id, secret = _a.secret;
                return [4 /*yield*/, node_fetch_1["default"]("https://accounts.spotify.com/api/token", {
                        body: "grant_type=refresh_token&client_id=" + id + "&client_secret=" + secret + "&refresh_token=" + refresh_token,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST"
                    })];
            case 3: return [4 /*yield*/, (_b.sent()).json()];
            case 4:
                json = _b.sent();
                return [2 /*return*/, json.access_token
                        ? change.after.ref.set({
                            access_token: json.access_token
                                ? json.access_token
                                : change.after.data().access_token,
                            refetch: false,
                            time: Date.now()
                        }, { merge: true })
                        : change.after.ref["delete"]()];
            case 5: return [2 /*return*/, Promise.resolve()];
        }
    });
}); });
