import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//Initial State

const InitialState = {
    loggingIn: false,
};

//Reducer

const reducer = (state = InitialState, action) => {
    switch(action.type){
        case "setLoggingIn":
            return { ...state, loggingIn: action.value}
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

export {setLoggingIn};