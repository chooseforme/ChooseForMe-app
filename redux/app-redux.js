import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebase from "firebase";
import { DeviceEventEmitter } from "react-native";
//Initial State

const InitialState = {
    loggingIn: false,
    publicPolls: [],
    refreshingPublicPolls: false,
    loadingPublicPolls: false,
    lastVisible: undefined,
};

//Reducer

const reducer = (state = InitialState, action) => {
    switch (action.type) {
        case "setLoggingIn":
            return { ...state, loggingIn: action.value };
        case "setPublicPolls":
            return { ...state, publicPolls: action.value };
        case "setRefreshingPublicPolls":
            return { ...state, refreshingPublicPolls: action.value };
        case "setLoadingPublicPolls":
            return { ...state, loadingPublicPolls: action.value };
        case "setLastVisible":
            return { ...state, lastVisible: action.value };
        default: return state;
    }

    return state;
};

//Store
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };


//action creator
const setLoggingIn = (logging) => {
    return {
        type: "setLoggingIn",
        value: logging,
    }
}

const setPublicPolls = (publicpolls) => {
    return {
        type: "setPublicPolls",
        value: publicpolls,
    }
}

const setLastVisible = (lastDoc) => {
    return {
        type: "setLastVisible",
        value: lastDoc,
    }
}

const setRefreshingPublicPolls = (refreshing) => {
    return {
        type: "setRefreshingPublicPolls",
        value: refreshing,
    }
}

const setLoadingPublicPolls = (loading) => {
    return {
        type: "setLoadingPublicPolls",
        value: loading,
    }
}

const refreshPublicPolls = () => {
    return function (dispatch, getState) {
        dispatch(setRefreshingPublicPolls(true));
        dispatch(setLastVisible(null));
        var db = firebase.firestore();
        db.collection("polls")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get()
            .then((querySnapshot) => {
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                dispatch(setLastVisible(lastVisible));
                var pollsdata = [];
                var promises = [];
                querySnapshot.forEach((doc) => {
                    console.log(doc.data().createdAt);
                    var data = doc.data();
                    data.id = doc.id;
                    data.authorName = "unknown";
                    var docRef = db.collection("users").doc(doc.data().author);
                    promises.push(
                        docRef.get().then((userdoc) => {
                            if (userdoc.exists) {
                                data.authorName = userdoc.data().displayName;
                                data.photoURL = userdoc.data().photoURL;
                                pollsdata.push(data);
                            }
                        }
                        ).catch((error) => {
                            console.log(error);
                        })
                    );
                })
                Promise.all(promises).then(
                    () => {
                        pollsdata.sort((a,b)=>{
                            if (a.createdAt > b.createdAt) {
                                return -1;
                              }
                              if (a.createdAt < b.createdAt) {
                                return 1;
                              }
                              // a must be equal to b
                              return 0;
                        })
                        dispatch(setPublicPolls(pollsdata));
                        dispatch(setRefreshingPublicPolls(false));
                    }
                ).catch((error) => {
                    console.log(error);
                })

            }).catch((error) => {
                console.log(error);
            });
    }
}

const loadPublicPolls = () => {
    return function (dispatch, getState) {
        if (getState().lastVisible == undefined) {
            return;
        }
        if (getState().loadingPublicPolls) {
            return;
        }
        dispatch(setLoadingPublicPolls(true));
        var db = firebase.firestore();
        db.collection("polls")
            .orderBy("createdAt", "desc")
            .limit(1)
            .startAfter(getState().lastVisible)
            .get()
            .then((querySnapshot) => {
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                dispatch(setLastVisible(lastVisible));
                var pollsdata = getState().publicPolls;
                var promises = [];
                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    data.id = doc.id;
                    data.authorName = "unknown";
                    var docRef = db.collection("users").doc(doc.data().author);
                    promises.push(
                        docRef.get().then((userdoc) => {
                            if (userdoc.exists) {
                                data.authorName = userdoc.data().displayName;
                                data.photoURL = userdoc.data().photoURL;
                                pollsdata.push(data);
                            }
                        }
                        ).catch((error) => {
                            console.log(error);
                        })
                    );
                })
                Promise.all(promises).then(
                    () => {
                        pollsdata.sort((a,b)=>{
                            if (a.createdAt > b.createdAt) {
                                return -1;
                              }
                              if (a.createdAt < b.createdAt) {
                                return 1;
                              }
                              // a must be equal to b
                              return 0;
                        })
                        dispatch(setPublicPolls(pollsdata));
                        dispatch(setLoadingPublicPolls(false));
                    }
                ).catch((error) => {
                    console.log(error);
                })

            }).catch((error) => {
                console.log(error);
            });
    }
}



const createUser = (res) => {
    return function (dispatch) {
        var db = firebase.firestore();
        var userRef = db.collection("users").doc(res.user.uid);
        userRef.get().then(
            (doc) => {
                if (!doc.exists) {
                    return false;
                }
                else {
                    return true;
                }
            }
        ).then((docExist) => {
            if (docExist) {
                userRef.set({
                    email: res.user.providerData[0].email,
                    photoURL: res.user.photoURL,
                }, { merge: true })
                    .then(function () {
                        console.log("User successfully updated!");
                    })
                    .catch(function (error) {
                        console.error("Error when updating user: ", error);
                    });
            }
            else {
                userRef.set({
                    displayName: res.user.displayName,
                    email: res.user.providerData[0].email,
                    photoURL: res.user.photoURL,
                    createdAt: Date.now(),
                }, { merge: true })
                    .then(function () {
                        console.log("User successfully Created!");
                    })
                    .catch(function (error) {
                        console.error("Error when creating user: ", error);
                    });
            }
        }
        ).catch((error) => {
            console.log(error);
        })
    }
}

export { setLoggingIn, setPublicPolls, refreshPublicPolls, loadPublicPolls , createUser};