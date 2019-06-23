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
            .orderBy("createdAt")
            .limit(5)
            .get()
            .then((querySnapshot) => {
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                dispatch(setLastVisible(lastVisible));
                var pollsdata = [];
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
        if(getState().lastVisible == undefined){
            return;
        }
        if(getState().loadingPublicPolls){
            return;
        }
        dispatch(setLoadingPublicPolls(true));
        var db = firebase.firestore();
        db.collection("polls")
            .orderBy("createdAt")
            .limit(5)
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

    }
}

export { setLoggingIn, setPublicPolls, refreshPublicPolls, loadPublicPolls };