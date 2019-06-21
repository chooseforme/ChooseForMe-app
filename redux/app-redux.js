import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebase from "firebase";

//Initial State

const InitialState = {
    loggingIn: false,
    publicPolls: [],
    refreshingPublicPolls: false,
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

const setRefreshingPublicPolls = (refreshing) => {
    return {
        type: "setRefreshingPublicPolls",
        value: refreshing,
    }
}

const updateSpecificPoll = (pollId) => {
    return function (dispatch) {
        var db = firebase.firestore();
        var pollRef = db.collection("polls").doc(pollId);
        pollRef.get().then((polldoc) => {
            var data = polldoc.data();
            data.id = polldoc.id;
            data.authorName = "unknown";
            var promises = [];
            var docRef = db.collection("users").doc(polldoc.data().author);
            promises.push(
                docRef.get().then((userdoc) => {
                    if (userdoc.exists) {
                        data.authorName = userdoc.data().displayName;
                        data.photoURL = userdoc.data().photoURL;
                    }
                }
                ).catch((error) => {
                    console.log(error);
                })
            );
            Promise.all(promises).then(()=>{
                var pollsdata = store.getState().publicPolls;
                const i = pollsdata.findIndex(_item => _item.id === data.id);
                if (i > -1) pollsdata[i] = data;
                else pollsdata.push(data);
                dispatch(setPublicPolls(pollsdata));
                console.log(store.getState().publicPolls);
            }).catch((err)=>{console.log(err);})
        }).catch((err)=>{
            console.log(err);
        })
    }
}


const watchPublicPolls = () => {
    return function (dispatch) {
        dispatch(setRefreshingPublicPolls(true));
        var db = firebase.firestore();
        db.collection("polls").get().then((querySnapshot) => {
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

export { setLoggingIn, setPublicPolls, watchPublicPolls, updateSpecificPoll };