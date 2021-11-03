// import {createStore} from 'redux';

// const ADD = "ADD";
// const DELETE = "DELETE";

// const reducer = (state="", action) => {
//     switch(action.type){
//         case ADD:
//             return [{text:action.text, id:Date.now()}, ...state];
//         case DELETE:
//             return state.filter(item => item !== action.id);
//         default:
//             return state;
//     }
// }

// const store = createStore(reducer); // createStore에는 reducer를 전달해야한다.
// // 사용은 store.dispatch(ACTION)  // -> action은 type을 키로 가지는 plian object임. 

// export default store;

import {createStore} from 'redux';

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const reducer = (state="", action) => {
    switch(action.type){
        case LOGIN:
            return [{userObj:action.userObj, isLoggedIn:true}, ...state];
        case LOGOUT:
            return [{userObj:null, isLoggedIn:false}, ...state];
        default:
            return state;
    }
}

const store = createStore(reducer); // createStore에는 reducer를 전달해야한다.
// 사용은 store.dispatch(ACTION)  // -> action은 type을 키로 가지는 plian object임. 

export default store;