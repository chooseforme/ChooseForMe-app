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

const createUser = (res) =>{
    return function (dispatch) {
        
    }
}

export { setLoggingIn, setPublicPolls, watchPublicPolls };