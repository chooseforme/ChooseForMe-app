import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebase from "firebase";

//Initial State

const InitialState = {
    loggingIn: false,
    publicPolls: [],
};

//Reducer

const reducer = (state = InitialState, action) => {
    switch (action.type) {
        case "setLoggingIn":
            return { ...state, loggingIn: action.value };
        case "setPublicPolls":
            return { ...state, publicPolls: action.value };
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

const watchPublicPolls = () => {
    return function (dispatch) {
        var pollsdata = [];
        var db = firebase.firestore();
        db.collection("polls").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //console.log(`${doc.id} => ${doc.data()}`);
                    var data = doc.data();
                    data.id = doc.id;
                    data.authorName = "unknown";
                    pollsdata.push(data);
                });
                console.log(pollsdata);
                dispatch(setPublicPolls(pollsdata));
        }
        );
        // pollsdata.forEach((poll)=>{
        //     var docRef = db.collection("users").doc(poll.author);
        //     docRef.get().then(function (userdoc) {
        //       if (userdoc.exists) {
        //         console.log("Author Name:", userdoc.displayName);
        //         poll.authorName = userdoc.data().displayName;
        //       } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //         poll.authorName = "unknown";
        //       }
        //       pollsdata.push(data);
        //     }).catch(function (error) {
        //       console.log("Error getting document:", error);
        //       poll.authorName = "unknown";
        //     });
        // })
    }
}

export { setLoggingIn, setPublicPolls, watchPublicPolls };